import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateCV } from '@/lib/gemini'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  console.log('POST /api/applications/public - Starting application submission')
  
  try {
    const body = await request.json()
    console.log('Request body received:', { ...body, resumeText: '[TRUNCATED]' })
    
    // Define schema inline to avoid initialization issues
    const schema = z.object({
      jobId: z.string().min(1, 'Job ID is required'),
      candidateName: z.string().min(1, 'Name is required'),
      candidateEmail: z.string().email('Valid email is required'),
      candidatePhone: z.string().optional(),
      resumeText: z.string().min(10, 'Resume content is required'),
      resumeUrl: z.string().default('text-resume'),
      githubUrl: z.string().url().optional().or(z.literal('')),
      websiteUrl: z.string().url().optional().or(z.literal('')),
      coverLetter: z.string().optional(),
      questionAnswers: z.record(z.string()).default({})
    })
    
    // Validate the request body
    const validation = schema.safeParse(body)
    
    if (!validation.success) {
      console.error('Validation failed:', validation.error.issues)
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }
    
    const validatedData = validation.data
    console.log('Data validated successfully')

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: {
        id: validatedData.jobId,
        status: 'ACTIVE'
      },
      include: {
        questions: true
      }
    })

    if (!job) {
      console.log('Job not found:', validatedData.jobId)
      return NextResponse.json(
        { error: 'Job not found or no longer active' },
        { status: 404 }
      )
    }

    console.log('Job found:', job.title)

    // Validate required custom questions
    const requiredQuestions = job.questions.filter(q => q.required)
    for (const question of requiredQuestions) {
      if (!validatedData.questionAnswers[question.id]?.trim()) {
        return NextResponse.json(
          { error: `Please answer required question: ${question.question}` },
          { status: 400 }
        )
      }
    }

    console.log('All required questions answered')

    // Create application and evaluate with AI in a transaction
    const result = await prisma.$transaction(async (tx) => {
      console.log('Creating application...')
      
      // Create the application
      const application = await tx.application.create({
        data: {
          jobId: validatedData.jobId,
          candidateName: validatedData.candidateName,
          candidateEmail: validatedData.candidateEmail,
          candidatePhone: validatedData.candidatePhone || null,
          resumeUrl: validatedData.resumeUrl,
          resumeText: validatedData.resumeText,
          githubUrl: validatedData.githubUrl || null,
          websiteUrl: validatedData.websiteUrl || null,
          coverLetter: validatedData.coverLetter || null,
          status: 'PENDING'
        }
      })

      console.log('Application created with ID:', application.id)

      // Save custom question answers
      if (Object.keys(validatedData.questionAnswers).length > 0) {
        const answerData = Object.entries(validatedData.questionAnswers).map(([questionId, answer]) => ({
          applicationId: application.id,
          questionId,
          answer
        }))

        await tx.jobQuestionAnswer.createMany({
          data: answerData
        })
        
        console.log('Custom question answers saved')
      }

      return application
    })

    console.log('Starting AI evaluation...')

    // Evaluate CV with Gemini AI (outside transaction to prevent long-running operations)
    let evaluationResult = null
    try {
      evaluationResult = await evaluateCV({
        jobTitle: job.title,
        jobDescription: job.description,
        resumeText: validatedData.resumeText,
        coverLetter: validatedData.coverLetter
      })

      console.log('AI evaluation completed:', {
        resumeScore: evaluationResult.resumeScore,
        coverLetterScore: evaluationResult.coverLetterScore,
        overallScore: evaluationResult.overallScore
      })

      // Save the AI evaluation scores
      await prisma.score.create({
        data: {
          applicationId: result.id,
          resumeScore: evaluationResult.resumeScore,
          coverLetterScore: evaluationResult.coverLetterScore || null,
          overallScore: evaluationResult.overallScore,
          strengths: JSON.stringify(evaluationResult.strengths),
          improvements: JSON.stringify(evaluationResult.improvements),
          tips: JSON.stringify(evaluationResult.tips),
          feedback: evaluationResult.feedback
        }
      })

      console.log('AI evaluation scores saved to database')

    } catch (evaluationError) {
      console.error('AI evaluation failed, saving fallback scores:', evaluationError)
      
      // Save fallback scores if AI evaluation fails
      await prisma.score.create({
        data: {
          applicationId: result.id,
          resumeScore: 6,
          coverLetterScore: validatedData.coverLetter ? 6 : null,
          overallScore: 6,
          strengths: JSON.stringify(['Application received successfully']),
          improvements: JSON.stringify(['Manual review required']),
          tips: JSON.stringify(['Application will be reviewed by hiring team']),
          feedback: 'Application received and will be reviewed manually by the hiring team.'
        }
      })
    }

    console.log('Application submission completed successfully')

    return NextResponse.json(
      { 
        message: 'Application submitted successfully',
        applicationId: result.id,
        evaluationCompleted: evaluationResult !== null,
        scores: evaluationResult ? {
          resumeScore: evaluationResult.resumeScore,
          coverLetterScore: evaluationResult.coverLetterScore,
          overallScore: evaluationResult.overallScore
        } : null
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating public application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    )
  }
}

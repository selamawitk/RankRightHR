import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDgT7F6M-_PtfXMcM4ZY2HRJhTUskyBCHc";

// Validate API key
if (!apiKey || apiKey === 'your-gemini-api-key-here') {
  console.warn('Gemini API key not properly configured. Using fallback evaluation.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export interface CVEvaluationData {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  coverLetter?: string;
}

export interface CVEvaluationResult {
  resumeScore: number; // 0-10
  coverLetterScore?: number; // 0-10
  overallScore: number; // 0-10
  strengths: string[];
  improvements: string[];
  tips: string[];
  feedback: string;
}

export async function evaluateCV(
  data: CVEvaluationData
): Promise<CVEvaluationResult> {
  console.log('Starting CV evaluation with Gemini...');
  
  try {
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `
You are an AI hiring assistant designed to evaluate job applications fairly and objectively. 

**BASIC INSTRUCTIONS:**
- Evaluate the candidate's resume and cover letter against the job requirements
- Rate the resume and cover letter out of 10 (where 10 is excellent, 5 is average, 1 is poor)
- Focus solely on professional qualifications, skills, experience, and job fit
- Do not consider or mention: name, age, gender, race, location, or any demographic information
- Provide constructive and actionable feedback

**JOB INFORMATION:**
Position: ${data.jobTitle}
Job Description: ${data.jobDescription}

**CANDIDATE MATERIALS:**
Resume/CV Content:
${data.resumeText}

${
  data.coverLetter
    ? `Cover Letter:
${data.coverLetter}`
    : "No cover letter provided."
}

**EVALUATION CRITERIA:**
1. **Resume (0-10):** Evaluate based on:
   - Relevant experience and skills
   - Education and certifications
   - Career progression and achievements
   - Clarity and presentation
   - Match with job requirements

2. **Cover Letter (0-10):** If provided, evaluate based on:
   - Understanding of the role and company
   - Communication skills and writing quality
   - Enthusiasm and motivation
   - Personalization and relevance
   - Professional tone

3. **Overall Score (0-10):** Weighted average considering job fit

**REQUIRED OUTPUT FORMAT:**
Please provide your evaluation in the following JSON format:
{
  "resumeScore": <number 0-10>,
  "coverLetterScore": <number 0-10 or null if no cover letter>,
  "overallScore": <number 0-10>,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2"],
  "tips": ["tip1", "tip2", "tip3"],
  "feedback": "Detailed paragraph explaining the evaluation and recommendations"
}

Provide only valid JSON, no additional text.
`;

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from Gemini:', text.substring(0, 200) + '...');

    // Clean the response text to remove any markdown formatting or extra text
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Find JSON object in the response
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    // Parse the JSON response
    let evaluationResult: CVEvaluationResult;

    try {
      evaluationResult = JSON.parse(cleanedText);
      console.log('Successfully parsed Gemini response');
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", cleanedText);
      console.error("Parse error:", parseError);
      throw new Error("Invalid response format from AI");
    }

    // Validate the response structure
    if (
      typeof evaluationResult.resumeScore !== "number" ||
      typeof evaluationResult.overallScore !== "number" ||
      !Array.isArray(evaluationResult.strengths) ||
      !Array.isArray(evaluationResult.improvements) ||
      !Array.isArray(evaluationResult.tips) ||
      typeof evaluationResult.feedback !== "string"
    ) {
      console.error("Invalid response structure:", evaluationResult);
      throw new Error("Invalid response structure from AI");
    }

    // Ensure scores are within valid range (0-10)
    evaluationResult.resumeScore = Math.max(
      0,
      Math.min(10, Math.round(evaluationResult.resumeScore))
    );
    evaluationResult.overallScore = Math.max(
      0,
      Math.min(10, Math.round(evaluationResult.overallScore))
    );

    if (
      evaluationResult.coverLetterScore !== null &&
      evaluationResult.coverLetterScore !== undefined
    ) {
      evaluationResult.coverLetterScore = Math.max(
        0,
        Math.min(10, Math.round(evaluationResult.coverLetterScore))
      );
    }

    console.log('CV evaluation completed successfully:', {
      resumeScore: evaluationResult.resumeScore,
      coverLetterScore: evaluationResult.coverLetterScore,
      overallScore: evaluationResult.overallScore
    });

    return evaluationResult;
  } catch (error) {
    console.error("Error evaluating CV with Gemini:", error);

    // Return fallback scores if Gemini fails
    const fallbackResult: CVEvaluationResult = {
      resumeScore: 6,
      coverLetterScore: data.coverLetter ? 6 : undefined,
      overallScore: 6,
      strengths: [
        "Application received and processed",
        "Candidate shows interest in the position",
        "Basic qualifications appear to be met",
      ],
      improvements: [
        "Detailed evaluation unavailable due to technical issues",
        "Manual review recommended",
      ],
      tips: [
        "Consider scheduling an interview for detailed assessment",
        "Review application materials manually",
        "Follow up with candidate for additional information",
      ],
      feedback:
        "Automatic evaluation was not successful. This application requires manual review by the hiring team to properly assess the candidate's qualifications and fit for the position.",
    };
    
    console.log('Using fallback evaluation result');
    return fallbackResult;
  }
}

// Simple CV text extraction function (basic implementation)
export function extractTextFromCV(cvContent: string): string {
  // For now, we'll assume the CV content is already text
  // In a real implementation, you'd want to handle PDF parsing, etc.
  return cvContent.trim();
}

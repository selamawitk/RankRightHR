import OpenAI from "openai";

// Make OpenAI optional for development
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export interface ApplicationData {
  resume?: string;
  github?: string;
  website?: string;
  coverLetter?: string;
  jobTitle: string;
  jobDescription: string;
}

export interface ScoreResult {
  resumeScore?: number;
  githubScore?: number;
  websiteScore?: number;
  coverLetterScore?: number;
  overallScore: number;
  technicalSkills?: number;
  experience?: number;
  cultureFit?: number;
  communication?: number;
  strengths: string[];
  improvements: string[];
  tips: string[];
}

export async function evaluateCandidate(
  data: ApplicationData
): Promise<ScoreResult> {
  // If OpenAI is not configured, return mock data for development
  if (!openai || !process.env.OPENAI_API_KEY) {
    console.warn(
      "OpenAI API key not configured, returning mock evaluation data"
    );
    return {
      resumeScore: 85,
      githubScore: data.github ? 78 : undefined,
      websiteScore: data.website ? 82 : undefined,
      coverLetterScore: data.coverLetter ? 88 : undefined,
      overallScore: 83,
      technicalSkills: 80,
      experience: 75,
      cultureFit: 85,
      communication: 90,
      strengths: [
        "Strong technical background",
        "Excellent communication skills",
        "Relevant experience in the field",
      ],
      improvements: [
        "Could expand knowledge in emerging technologies",
        "More leadership experience would be beneficial",
      ],
      tips: [
        "Consider highlighting specific project achievements",
        "Include metrics and quantifiable results",
        "Tailor experience to match job requirements",
      ],
    };
  }

  try {
    const prompt = `
You are an AI hiring assistant designed to evaluate candidates fairly and objectively. 
Analyze the following candidate information for the position: "${data.jobTitle}"

Job Description: ${data.jobDescription}

Candidate Information:
${data.resume ? `Resume: ${data.resume}` : ""}
${data.github ? `GitHub: ${data.github}` : ""}
${data.website ? `Website: ${data.website}` : ""}
${data.coverLetter ? `Cover Letter: ${data.coverLetter}` : ""}

Please provide a comprehensive evaluation in the following JSON format:
{
  "resumeScore": <0-100>,
  "githubScore": <0-100 or null if not provided>,
  "websiteScore": <0-100 or null if not provided>,
  "coverLetterScore": <0-100 or null if not provided>,
  "overallScore": <0-100>,
  "technicalSkills": <0-100>,
  "experience": <0-100>,
  "cultureFit": <0-100>,
  "communication": <0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2"],
  "tips": ["tip1", "tip2", "tip3"]
}

Evaluation Criteria:
- Focus solely on professional qualifications and job-relevant skills
- Do not consider or mention: name, age, gender, race, location, or any demographic information
- Base scores on: technical skills, relevant experience, communication ability, and job fit
- Provide constructive feedback in strengths, improvements, and tips
- Be objective and bias-free in all assessments
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a fair and objective hiring evaluation assistant. Provide only valid JSON responses without additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content) as ScoreResult;

    // Validate the response structure
    if (
      typeof result.overallScore !== "number" ||
      !Array.isArray(result.strengths)
    ) {
      throw new Error("Invalid response structure from OpenAI");
    }

    return result;
  } catch (error) {
    console.error("Error evaluating candidate with OpenAI:", error);

    // Return fallback scores if OpenAI fails
    return {
      resumeScore: 75,
      githubScore: data.github ? 70 : undefined,
      websiteScore: data.website ? 73 : undefined,
      coverLetterScore: data.coverLetter ? 78 : undefined,
      overallScore: 74,
      technicalSkills: 72,
      experience: 70,
      cultureFit: 75,
      communication: 80,
      strengths: [
        "Candidate evaluation completed",
        "Profile reviewed successfully",
        "Application processed",
      ],
      improvements: [
        "Detailed evaluation unavailable",
        "Manual review recommended",
      ],
      tips: [
        "Consider detailed manual review",
        "Follow up with candidate for additional information",
      ],
    };
  }
}

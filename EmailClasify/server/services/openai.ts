import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "default_key"
});

export interface ClassificationResult {
  primaryCategory: string;
  confidenceScores: {
    complaint: number;
    query: number;
    feedback: number;
    lead: number;
  };
  analysisSummary: string[];
}

function getDemoClassification(emailContent: string): ClassificationResult {
  const content = emailContent.toLowerCase();
  
  // Simple keyword-based classification for demo
  let primaryCategory = "query";
  let confidenceScores = {
    complaint: 25,
    query: 50,
    feedback: 15,
    lead: 10
  };
  let analysisSummary = ["Demo mode: Using keyword-based classification", "Real AI analysis requires valid OpenAI API key"];

  if (content.includes("disappointed") || content.includes("problem") || content.includes("issue") || 
      content.includes("refund") || content.includes("damaged") || content.includes("complaint")) {
    primaryCategory = "complaint";
    confidenceScores = { complaint: 85, query: 10, feedback: 3, lead: 2 };
    analysisSummary = [
      "Strong negative sentiment detected",
      "Keywords indicate dissatisfaction with product/service",
      "Request for resolution or refund identified",
      "Demo mode: Real AI would provide deeper analysis"
    ];
  } else if (content.includes("interested") || content.includes("pricing") || content.includes("purchase") || 
             content.includes("buy") || content.includes("quote")) {
    primaryCategory = "lead";
    confidenceScores = { complaint: 5, query: 15, feedback: 5, lead: 75 };
    analysisSummary = [
      "Sales interest indicators found",
      "Potential customer engagement detected",
      "Commercial inquiry patterns identified",
      "Demo mode: Real AI would analyze intent more accurately"
    ];
  } else if (content.includes("suggest") || content.includes("feedback") || content.includes("recommend") || 
             content.includes("improve")) {
    primaryCategory = "feedback";
    confidenceScores = { complaint: 10, query: 20, feedback: 65, lead: 5 };
    analysisSummary = [
      "Constructive input patterns detected",
      "Suggestion or improvement focus identified",
      "Customer engagement with product experience",
      "Demo mode: Real AI would analyze sentiment nuances"
    ];
  }

  return {
    primaryCategory,
    confidenceScores,
    analysisSummary
  };
}

export async function classifyEmail(emailContent: string): Promise<ClassificationResult> {
  // Check if we're in demo mode (no valid API key)
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "default_key" || apiKey.includes("sk-or-v1")) {
    return getDemoClassification(emailContent);
  }

  try {
    const prompt = `You are an expert email classifier for customer service. Analyze the following email and classify it into one of these categories:

1. COMPLAINT - Customer expressing dissatisfaction, issues, or problems with products/services
2. QUERY - Customer seeking information, support, or clarification about products/services  
3. FEEDBACK - Customer providing suggestions, reviews, or constructive input about experiences
4. LEAD - Potential customer showing interest in products/services or sales opportunities

Provide your analysis in JSON format with:
- primaryCategory: the main category (complaint, query, feedback, or lead)
- confidenceScores: object with percentage confidence for each category (0-100)
- analysisSummary: array of 2-4 key insights about why this classification was chosen

Email Content:
${emailContent}

Respond with valid JSON only.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert email classifier. Always respond with valid JSON in the exact format requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    // Validate and normalize the response
    const confidenceScores = {
      complaint: Math.max(0, Math.min(100, result.confidenceScores?.complaint || 0)),
      query: Math.max(0, Math.min(100, result.confidenceScores?.query || 0)),
      feedback: Math.max(0, Math.min(100, result.confidenceScores?.feedback || 0)),
      lead: Math.max(0, Math.min(100, result.confidenceScores?.lead || 0)),
    };

    return {
      primaryCategory: result.primaryCategory?.toLowerCase() || "query",
      confidenceScores,
      analysisSummary: Array.isArray(result.analysisSummary) ? result.analysisSummary : [
        "Email analysis completed",
        "Classification based on content analysis"
      ]
    };

  } catch (error) {
    console.error("OpenAI classification error:", error);
    throw new Error("Failed to classify email. Please check your OpenAI API key and try again.");
  }
}

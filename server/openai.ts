import OpenAI from "openai";
import type { Challenge } from "@shared/schema";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateChallenge(
  topic: string,
  difficulty: "easy" | "medium" | "hard"
): Promise<Omit<Challenge, "id" | "createdAt">> {
  const difficultyPoints = {
    easy: 100,
    medium: 250,
    hard: 500,
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at creating engaging trivia and puzzle challenges. Generate challenges across various categories like movies, sports, technology, and general knowledge. The challenge should be fun, educational, and include a clear question with a specific answer. The response should be a JSON object with title, description, category, points, answer, and hint fields. Make the description engaging and the hint helpful but not too revealing.",
        },
        {
          role: "user",
          content: `Create a ${difficulty} difficulty challenge about ${topic}. Make it engaging and fun!`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const result = JSON.parse(content);

    return {
      title: result.title,
      description: result.description,
      category: result.category.toLowerCase(),
      points: result.points || difficultyPoints[difficulty],
      answer: result.answer,
      hint: result.hint,
      aiGenerated: true,
    };
  } catch (error) {
    console.error("Failed to generate challenge:", error);
    throw new Error("Failed to generate challenge with OpenAI");
  }
}

// Add AI Chat Assistant
export async function getChatResponse(
  message: string
): Promise<{ response: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful CTF assistant. You can provide hints and guidance for solving challenges, but never give direct answers. Encourage learning and understanding rather than just providing solutions.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    return { response: content };
  } catch (error) {
    console.error("Failed to get chat response:", error);
    throw new Error("Failed to get response from AI assistant");
  }
}
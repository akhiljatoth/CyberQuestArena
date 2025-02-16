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
            "You are a cybersecurity expert creating CTF challenges. Generate a challenge that is both educational and engaging. The response should be a JSON object with title, description, category, points, and answer fields. The description should include clear instructions and any necessary context, but should not reveal the answer. The answer should be specific and unambiguous.",
        },
        {
          role: "user",
          content: `Create a ${difficulty} difficulty challenge about ${topic}. The challenge should be solvable without external tools.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const result = JSON.parse(content);

    // Validate and format the response
    return {
      title: result.title,
      description: result.description,
      category: result.category.toLowerCase(),
      points: result.points || difficultyPoints[difficulty],
      answer: result.answer,
      aiGenerated: true,
    };
  } catch (error) {
    console.error("Failed to generate challenge:", error);
    throw new Error("Failed to generate challenge with OpenAI");
  }
}
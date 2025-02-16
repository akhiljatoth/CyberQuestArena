import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Challenge } from "@shared/schema";

const genAI = new GoogleGenerativeAI("AIzaSyD7eD7YQFVUL5OYOmLt6UHjwgDBYhy0RvE");

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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are an expert at creating engaging trivia and puzzle challenges. Generate a ${difficulty} difficulty challenge about ${topic}. Make it fun, educational, and engaging. Provide a JSON response with title, description, category, points, answer, and hint.`;

    const result = await model.generateContent(prompt);
    const content = result.response.text();
    if (!content) {
      throw new Error("No content received from Gemini");
    }

    const challengeData = JSON.parse(content);
    return {
      title: challengeData.title,
      description: challengeData.description,
      category: challengeData.category.toLowerCase(),
      points: challengeData.points || difficultyPoints[difficulty],
      answer: challengeData.answer,
      hint: challengeData.hint,
      aiGenerated: true,
    };
  } catch (error) {
    console.error("Failed to generate challenge:", error);
    throw new Error("Failed to generate challenge with Gemini");
  }
}

export async function getChatResponse(
  message: string
): Promise<{ response: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are a helpful CTF assistant. You can provide hints and guidance for solving challenges, but never give direct answers. Encourage learning and understanding rather than just providing solutions.\n\nUser: ${message}`;

    const result = await model.generateContent(prompt);
    const content = result.response.text();
    if (!content) {
      throw new Error("No content received from Gemini");
    }

    return { response: content };
  } catch (error) {
    console.error("Failed to get chat response:", error);
    throw new Error("Failed to get response from AI assistant");
  }
}

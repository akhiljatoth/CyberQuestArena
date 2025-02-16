import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertChallengeSchema, insertSubmissionSchema } from "@shared/schema";
import { ZodError } from "zod";
import { generateChallenge } from "./openai";

function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Challenge routes
  app.get("/api/challenges", requireAuth, async (req, res) => {
    const challenges = await storage.getAllChallenges();
    res.json(challenges);
  });

  app.post("/api/challenges", requireAdmin, async (req, res) => {
    try {
      const challenge = insertChallengeSchema.parse(req.body);
      const created = await storage.createChallenge(challenge);
      res.status(201).json(created);
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json({ message: e.message });
        return;
      }
      throw e;
    }
  });

  app.post("/api/challenges/generate", requireAdmin, async (req, res) => {
    try {
      const { topic, difficulty } = req.body;

      if (!topic || !["easy", "medium", "hard"].includes(difficulty)) {
        return res.status(400).json({ 
          message: "Invalid request. Topic is required and difficulty must be 'easy', 'medium', or 'hard'." 
        });
      }

      const challenge = await generateChallenge(topic, difficulty);
      const created = await storage.createChallenge({
        ...challenge,
        aiGenerated: true
      });
      res.status(201).json(created);
    } catch (error) {
      console.error("Challenge generation failed:", error);
      res.status(500).json({ 
        message: "Failed to generate challenge. Please try again or contact support if the issue persists." 
      });
    }
  });

  // Submission routes
  app.post("/api/submissions", requireAuth, async (req, res) => {
    try {
      const submission = insertSubmissionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const challenge = await storage.getChallenge(submission.challengeId);
      if (!challenge) {
        res.status(404).json({ message: "Challenge not found" });
        return;
      }

      const isCorrect = challenge.answer === submission.answer;
      const created = await storage.createSubmission({
        ...submission,
        correct: isCorrect
      });

      if (isCorrect) {
        await storage.updateUserScore(req.user.id, challenge.points);
      }

      res.status(201).json(created);
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json({ message: e.message });
        return;
      }
      throw e;
    }
  });

  // Entertainment routes
  app.get("/api/entertainment", requireAuth, async (req, res) => {
    const content = await storage.getAllEntertainmentContent();
    res.json(content);
  });

  // Leaderboard route
  app.get("/api/leaderboard", requireAuth, async (req, res) => {
    const topUsers = await storage.getTopUsers(10);
    res.json(topUsers);
  });

  const httpServer = createServer(app);
  return httpServer;
}
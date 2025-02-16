import { InsertUser, User, Challenge, Submission, Entertainment } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserScore(userId: number, points: number): Promise<void>;
  
  // Challenge operations
  createChallenge(challenge: Omit<Challenge, "id" | "createdAt">): Promise<Challenge>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  getAllChallenges(): Promise<Challenge[]>;
  
  // Submission operations
  createSubmission(submission: Omit<Submission, "id" | "submittedAt">): Promise<Submission>;
  getSubmissionsByUser(userId: number): Promise<Submission[]>;
  
  // Entertainment operations
  createEntertainmentContent(content: Omit<Entertainment, "id">): Promise<Entertainment>;
  getAllEntertainmentContent(): Promise<Entertainment[]>;
  
  // Leaderboard
  getTopUsers(limit: number): Promise<User[]>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private challenges: Map<number, Challenge>;
  private submissions: Map<number, Submission>;
  private entertainment: Map<number, Entertainment>;
  private currentId: { [key: string]: number };
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.submissions = new Map();
    this.entertainment = new Map();
    this.currentId = { users: 1, challenges: 1, submissions: 1, entertainment: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, isAdmin: false, score: 0 };
    this.users.set(id, user);
    return user;
  }

  async updateUserScore(userId: number, points: number): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      user.score += points;
      this.users.set(userId, user);
    }
  }

  async createChallenge(challenge: Omit<Challenge, "id" | "createdAt">): Promise<Challenge> {
    const id = this.currentId.challenges++;
    const newChallenge: Challenge = {
      ...challenge,
      id,
      createdAt: new Date()
    };
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }

  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async createSubmission(submission: Omit<Submission, "id" | "submittedAt">): Promise<Submission> {
    const id = this.currentId.submissions++;
    const newSubmission: Submission = {
      ...submission,
      id,
      submittedAt: new Date()
    };
    this.submissions.set(id, newSubmission);
    return newSubmission;
  }

  async getSubmissionsByUser(userId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (sub) => sub.userId === userId
    );
  }

  async createEntertainmentContent(content: Omit<Entertainment, "id">): Promise<Entertainment> {
    const id = this.currentId.entertainment++;
    const newContent: Entertainment = { ...content, id };
    this.entertainment.set(id, newContent);
    return newContent;
  }

  async getAllEntertainmentContent(): Promise<Entertainment[]> {
    return Array.from(this.entertainment.values());
  }

  async getTopUsers(limit: number): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

export const storage = new MemStorage();

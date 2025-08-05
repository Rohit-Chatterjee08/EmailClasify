import { type User, type InsertUser, type EmailClassification } from "@shared/schema";
import { randomUUID } from "crypto";
import { ClassificationResult } from "./services/openai";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createEmailClassification(data: {
    emailContent: string;
    primaryCategory: string;
    confidenceScores: any;
    analysisSummary: string;
  }): Promise<EmailClassification>;
  getClassificationStats(): Promise<{
    complaints: number;
    queries: number;
    feedback: number;
    leads: number;
    total: number;
  }>;
  getClassificationHistory(): Promise<EmailClassification[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emailClassifications: Map<string, EmailClassification>;

  constructor() {
    this.users = new Map();
    this.emailClassifications = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createEmailClassification(data: {
    emailContent: string;
    primaryCategory: string;
    confidenceScores: any;
    analysisSummary: string;
  }): Promise<EmailClassification> {
    const id = randomUUID();
    const classification: EmailClassification = {
      id,
      emailContent: data.emailContent,
      primaryCategory: data.primaryCategory,
      confidenceScores: data.confidenceScores,
      analysisSummary: data.analysisSummary,
      createdAt: new Date(),
    };
    this.emailClassifications.set(id, classification);
    return classification;
  }

  async getClassificationStats(): Promise<{
    complaints: number;
    queries: number;
    feedback: number;
    leads: number;
    total: number;
  }> {
    const classifications = Array.from(this.emailClassifications.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayClassifications = classifications.filter(c => 
      c.createdAt && c.createdAt >= today
    );

    const stats = {
      complaints: todayClassifications.filter(c => c.primaryCategory === 'complaint').length,
      queries: todayClassifications.filter(c => c.primaryCategory === 'query').length,
      feedback: todayClassifications.filter(c => c.primaryCategory === 'feedback').length,
      leads: todayClassifications.filter(c => c.primaryCategory === 'lead').length,
      total: todayClassifications.length,
    };

    return stats;
  }

  async getClassificationHistory(): Promise<EmailClassification[]> {
    const classifications = Array.from(this.emailClassifications.values());
    return classifications
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, 50); // Return last 50 classifications
  }
}

export const storage = new MemStorage();

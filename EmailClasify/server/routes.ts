import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { classificationRequestSchema } from "@shared/schema";
import { classifyEmail } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Email classification endpoint
  app.post("/api/classify", async (req, res) => {
    try {
      const { emailContent } = classificationRequestSchema.parse(req.body);
      
      const result = await classifyEmail(emailContent);
      
      // Store the classification result
      const classification = await storage.createEmailClassification({
        emailContent,
        primaryCategory: result.primaryCategory,
        confidenceScores: result.confidenceScores,
        analysisSummary: result.analysisSummary.join("; ")
      });

      res.json(result);
    } catch (error: any) {
      console.error("Classification error:", error);
      if (error.message?.includes("API key")) {
        res.status(401).json({ 
          message: "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable." 
        });
      } else if (error.issues) {
        res.status(400).json({ 
          message: "Invalid email content", 
          errors: error.issues 
        });
      } else {
        res.status(500).json({ 
          message: error.message || "Failed to classify email" 
        });
      }
    }
  });

  // Get classification statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getClassificationStats();
      res.json(stats);
    } catch (error: any) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "Failed to get statistics" });
    }
  });

  // Get classification history
  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getClassificationHistory();
      res.json(history);
    } catch (error: any) {
      console.error("History error:", error);
      res.status(500).json({ message: "Failed to get classification history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

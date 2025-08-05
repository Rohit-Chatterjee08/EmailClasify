import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const emailClassifications = pgTable("email_classifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  emailContent: text("email_content").notNull(),
  primaryCategory: text("primary_category").notNull(),
  confidenceScores: jsonb("confidence_scores").notNull(),
  analysisSummary: text("analysis_summary"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEmailClassificationSchema = createInsertSchema(emailClassifications).pick({
  emailContent: true,
});

export const classificationRequestSchema = z.object({
  emailContent: z.string().min(10, "Email content must be at least 10 characters long"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type EmailClassification = typeof emailClassifications.$inferSelect;
export type InsertEmailClassification = z.infer<typeof insertEmailClassificationSchema>;
export type ClassificationRequest = z.infer<typeof classificationRequestSchema>;

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

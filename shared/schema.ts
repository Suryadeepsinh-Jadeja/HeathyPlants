import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(), // In a real app we'd upload to S3, here we might store base64 or just log it
  predictions: jsonb("predictions").notNull(), // Store the array of probabilities
  topLabel: text("top_label").notNull(),
  confidence: text("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScanSchema = createInsertSchema(scans).omit({ 
  id: true, 
  createdAt: true 
});

export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;

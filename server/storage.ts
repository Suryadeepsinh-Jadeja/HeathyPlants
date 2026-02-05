import { db } from "./db";
import { scans, type Scan, type InsertScan } from "@shared/schema";

export interface IStorage {
  getScans(): Promise<Scan[]>;
  createScan(scan: InsertScan): Promise<Scan>;
}

export class DatabaseStorage implements IStorage {
  async getScans(): Promise<Scan[]> {
    return await db.select().from(scans).orderBy(scans.createdAt);
  }

  async createScan(insertScan: InsertScan): Promise<Scan> {
    const [scan] = await db
      .insert(scans)
      .values(insertScan)
      .returning();
    return scan;
  }
}

export const storage = new DatabaseStorage();

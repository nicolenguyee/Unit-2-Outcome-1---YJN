import {
  users,
  medications,
  medicationSchedules,
  medicationLogs,
  healthMetrics,
  healthGoals,
  healthTips,
  appointments,
  type User,
  type UpsertUser,
  type Medication,
  type InsertMedication,
  type MedicationSchedule,
  type InsertMedicationSchedule,
  type MedicationLog,
  type InsertMedicationLog,
  type HealthMetric,
  type InsertHealthMetric,
  type HealthGoal,
  type InsertHealthGoal,
  type HealthTip,
  type Appointment,
  type InsertAppointment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Medication operations
  createMedication(medication: InsertMedication): Promise<Medication>;
  getMedicationsByUserId(userId: string): Promise<Medication[]>;
  updateMedication(id: string, updates: Partial<InsertMedication>): Promise<Medication | undefined>;
  deleteMedication(id: string): Promise<void>;

  // Medication schedule operations
  createMedicationSchedule(schedule: InsertMedicationSchedule): Promise<MedicationSchedule>;
  getSchedulesByMedicationId(medicationId: string): Promise<MedicationSchedule[]>;

  // Medication log operations
  createMedicationLog(log: InsertMedicationLog): Promise<MedicationLog>;
  getMedicationLogsByUserId(userId: string, startDate?: Date, endDate?: Date): Promise<(MedicationLog & { medication: Medication })[]>;
  updateMedicationLog(id: string, updates: Partial<InsertMedicationLog>): Promise<MedicationLog | undefined>;

  // Health metrics operations
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  getHealthMetricsByUserId(userId: string, type?: string): Promise<HealthMetric[]>;
  getLatestHealthMetricByType(userId: string, type: string): Promise<HealthMetric | undefined>;

  // Health goals operations
  createHealthGoal(goal: InsertHealthGoal): Promise<HealthGoal>;
  getHealthGoalsByUserId(userId: string): Promise<HealthGoal[]>;
  updateHealthGoal(id: string, updates: Partial<InsertHealthGoal>): Promise<HealthGoal | undefined>;

  // Health tips operations
  getActiveHealthTips(): Promise<HealthTip[]>;
  getDailyHealthTip(): Promise<HealthTip | undefined>;

  // Appointment operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByUserId(userId: string): Promise<Appointment[]>;
  getUpcomingAppointments(userId: string): Promise<Appointment[]>;
  updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Medication operations
  async createMedication(medication: InsertMedication): Promise<Medication> {
    const [newMedication] = await db
      .insert(medications)
      .values(medication)
      .returning();
    return newMedication;
  }

  async getMedicationsByUserId(userId: string): Promise<Medication[]> {
    return await db
      .select()
      .from(medications)
      .where(and(eq(medications.userId, userId), eq(medications.isActive, true)))
      .orderBy(desc(medications.createdAt));
  }

  async updateMedication(id: string, updates: Partial<InsertMedication>): Promise<Medication | undefined> {
    const [updated] = await db
      .update(medications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(medications.id, id))
      .returning();
    return updated;
  }

  async deleteMedication(id: string): Promise<void> {
    await db
      .update(medications)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(medications.id, id));
  }

  // Medication schedule operations
  async createMedicationSchedule(schedule: InsertMedicationSchedule): Promise<MedicationSchedule> {
    const [newSchedule] = await db
      .insert(medicationSchedules)
      .values(schedule)
      .returning();
    return newSchedule;
  }

  async getSchedulesByMedicationId(medicationId: string): Promise<MedicationSchedule[]> {
    return await db
      .select()
      .from(medicationSchedules)
      .where(eq(medicationSchedules.medicationId, medicationId));
  }

  // Medication log operations
  async createMedicationLog(log: InsertMedicationLog): Promise<MedicationLog> {
    const [newLog] = await db
      .insert(medicationLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async getMedicationLogsByUserId(userId: string, startDate?: Date, endDate?: Date): Promise<(MedicationLog & { medication: Medication })[]> {
    let conditions = [eq(medications.userId, userId)];
    if (startDate) {
      conditions.push(gte(medicationLogs.scheduledDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(medicationLogs.scheduledDate, endDate));
    }
    
    const results = await db
      .select({
        id: medicationLogs.id,
        medicationId: medicationLogs.medicationId,
        scheduledDate: medicationLogs.scheduledDate,
        takenAt: medicationLogs.takenAt,
        status: medicationLogs.status,
        notes: medicationLogs.notes,
        createdAt: medicationLogs.createdAt,
        medication: medications,
      })
      .from(medicationLogs)
      .innerJoin(medications, eq(medicationLogs.medicationId, medications.id))
      .where(and(...conditions))
      .orderBy(desc(medicationLogs.scheduledDate));

    return results;
  }

  async updateMedicationLog(id: string, updates: Partial<InsertMedicationLog>): Promise<MedicationLog | undefined> {
    const [updated] = await db
      .update(medicationLogs)
      .set(updates)
      .where(eq(medicationLogs.id, id))
      .returning();
    return updated;
  }

  // Health metrics operations
  async createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric> {
    const [newMetric] = await db
      .insert(healthMetrics)
      .values(metric)
      .returning();
    return newMetric;
  }

  async getHealthMetricsByUserId(userId: string, type?: string): Promise<HealthMetric[]> {
    let conditions = [eq(healthMetrics.userId, userId)];
    
    if (type) {
      conditions.push(eq(healthMetrics.type, type));
    }

    return await db
      .select()
      .from(healthMetrics)
      .where(and(...conditions))
      .orderBy(desc(healthMetrics.recordedAt));
  }

  async getLatestHealthMetricByType(userId: string, type: string): Promise<HealthMetric | undefined> {
    const [metric] = await db
      .select()
      .from(healthMetrics)
      .where(and(eq(healthMetrics.userId, userId), eq(healthMetrics.type, type)))
      .orderBy(desc(healthMetrics.recordedAt))
      .limit(1);
    return metric;
  }

  // Health goals operations
  async createHealthGoal(goal: InsertHealthGoal): Promise<HealthGoal> {
    const [newGoal] = await db
      .insert(healthGoals)
      .values(goal)
      .returning();
    return newGoal;
  }

  async getHealthGoalsByUserId(userId: string): Promise<HealthGoal[]> {
    return await db
      .select()
      .from(healthGoals)
      .where(and(eq(healthGoals.userId, userId), eq(healthGoals.isActive, true)))
      .orderBy(desc(healthGoals.createdAt));
  }

  async updateHealthGoal(id: string, updates: Partial<InsertHealthGoal>): Promise<HealthGoal | undefined> {
    const [updated] = await db
      .update(healthGoals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(healthGoals.id, id))
      .returning();
    return updated;
  }

  // Health tips operations
  async getActiveHealthTips(): Promise<HealthTip[]> {
    return await db
      .select()
      .from(healthTips)
      .where(eq(healthTips.isActive, true))
      .orderBy(desc(healthTips.createdAt));
  }

  async getDailyHealthTip(): Promise<HealthTip | undefined> {
    const [tip] = await db
      .select()
      .from(healthTips)
      .where(eq(healthTips.isActive, true))
      .orderBy(sql`RANDOM()`)
      .limit(1);
    return tip;
  }

  // Appointment operations
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  async getAppointmentsByUserId(userId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.appointmentDate));
  }

  async getUpcomingAppointments(userId: string): Promise<Appointment[]> {
    const now = new Date();
    return await db
      .select()
      .from(appointments)
      .where(and(
        eq(appointments.userId, userId),
        gte(appointments.appointmentDate, now),
        eq(appointments.status, "scheduled")
      ))
      .orderBy(appointments.appointmentDate)
      .limit(5);
  }

  async updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [updated] = await db
      .update(appointments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertMedicationSchema,
  insertMedicationScheduleSchema,
  insertMedicationLogSchema,
  insertHealthMetricSchema,
  insertHealthGoalSchema,
  insertAppointmentSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Medication routes
  app.post("/api/medications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const medicationData = insertMedicationSchema.parse({ ...req.body, userId });
      const medication = await storage.createMedication(medicationData);
      res.json(medication);
    } catch (error) {
      console.error("Error creating medication:", error);
      res.status(400).json({ message: "Failed to create medication" });
    }
  });

  app.get("/api/medications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const medications = await storage.getMedicationsByUserId(userId);
      res.json(medications);
    } catch (error) {
      console.error("Error fetching medications:", error);
      res.status(500).json({ message: "Failed to fetch medications" });
    }
  });

  app.patch("/api/medications/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = insertMedicationSchema.partial().parse(req.body);
      const medication = await storage.updateMedication(id, updates);
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      res.json(medication);
    } catch (error) {
      console.error("Error updating medication:", error);
      res.status(400).json({ message: "Failed to update medication" });
    }
  });

  app.delete("/api/medications/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMedication(id);
      res.json({ message: "Medication deleted successfully" });
    } catch (error) {
      console.error("Error deleting medication:", error);
      res.status(500).json({ message: "Failed to delete medication" });
    }
  });

  // Medication schedule routes
  app.post("/api/medications/:medicationId/schedules", isAuthenticated, async (req: any, res) => {
    try {
      const { medicationId } = req.params;
      const scheduleData = insertMedicationScheduleSchema.parse({ ...req.body, medicationId });
      const schedule = await storage.createMedicationSchedule(scheduleData);
      res.json(schedule);
    } catch (error) {
      console.error("Error creating medication schedule:", error);
      res.status(400).json({ message: "Failed to create medication schedule" });
    }
  });

  app.get("/api/medications/:medicationId/schedules", isAuthenticated, async (req: any, res) => {
    try {
      const { medicationId } = req.params;
      const schedules = await storage.getSchedulesByMedicationId(medicationId);
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching medication schedules:", error);
      res.status(500).json({ message: "Failed to fetch medication schedules" });
    }
  });

  // Medication log routes
  app.post("/api/medication-logs", isAuthenticated, async (req: any, res) => {
    try {
      const logData = insertMedicationLogSchema.parse(req.body);
      const log = await storage.createMedicationLog(logData);
      res.json(log);
    } catch (error) {
      console.error("Error creating medication log:", error);
      res.status(400).json({ message: "Failed to create medication log" });
    }
  });

  app.get("/api/medication-logs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const logs = await storage.getMedicationLogsByUserId(userId, start, end);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching medication logs:", error);
      res.status(500).json({ message: "Failed to fetch medication logs" });
    }
  });

  app.patch("/api/medication-logs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = insertMedicationLogSchema.partial().parse(req.body);
      const log = await storage.updateMedicationLog(id, updates);
      if (!log) {
        return res.status(404).json({ message: "Medication log not found" });
      }
      res.json(log);
    } catch (error) {
      console.error("Error updating medication log:", error);
      res.status(400).json({ message: "Failed to update medication log" });
    }
  });

  // Health metrics routes
  app.post("/api/health-metrics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const metricData = insertHealthMetricSchema.parse({ ...req.body, userId });
      const metric = await storage.createHealthMetric(metricData);
      res.json(metric);
    } catch (error) {
      console.error("Error creating health metric:", error);
      res.status(400).json({ message: "Failed to create health metric" });
    }
  });

  app.get("/api/health-metrics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type } = req.query;
      const metrics = await storage.getHealthMetricsByUserId(userId, type as string);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      res.status(500).json({ message: "Failed to fetch health metrics" });
    }
  });

  app.get("/api/health-metrics/latest/:type", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type } = req.params;
      const metric = await storage.getLatestHealthMetricByType(userId, type);
      res.json(metric);
    } catch (error) {
      console.error("Error fetching latest health metric:", error);
      res.status(500).json({ message: "Failed to fetch latest health metric" });
    }
  });

  // Health goals routes
  app.post("/api/health-goals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goalData = insertHealthGoalSchema.parse({ ...req.body, userId });
      const goal = await storage.createHealthGoal(goalData);
      res.json(goal);
    } catch (error) {
      console.error("Error creating health goal:", error);
      res.status(400).json({ message: "Failed to create health goal" });
    }
  });

  app.get("/api/health-goals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goals = await storage.getHealthGoalsByUserId(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching health goals:", error);
      res.status(500).json({ message: "Failed to fetch health goals" });
    }
  });

  app.patch("/api/health-goals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = insertHealthGoalSchema.partial().parse(req.body);
      const goal = await storage.updateHealthGoal(id, updates);
      if (!goal) {
        return res.status(404).json({ message: "Health goal not found" });
      }
      res.json(goal);
    } catch (error) {
      console.error("Error updating health goal:", error);
      res.status(400).json({ message: "Failed to update health goal" });
    }
  });

  // Health tips routes
  app.get("/api/health-tips", async (req, res) => {
    try {
      const tips = await storage.getActiveHealthTips();
      res.json(tips);
    } catch (error) {
      console.error("Error fetching health tips:", error);
      res.status(500).json({ message: "Failed to fetch health tips" });
    }
  });

  app.get("/api/health-tips/daily", async (req, res) => {
    try {
      const tip = await storage.getDailyHealthTip();
      res.json(tip);
    } catch (error) {
      console.error("Error fetching daily health tip:", error);
      res.status(500).json({ message: "Failed to fetch daily health tip" });
    }
  });

  // Appointment routes
  app.post("/api/appointments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointmentData = insertAppointmentSchema.parse({ ...req.body, userId });
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(400).json({ message: "Failed to create appointment" });
    }
  });

  app.get("/api/appointments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointments = await storage.getAppointmentsByUserId(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/upcoming", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointments = await storage.getUpcomingAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
      res.status(500).json({ message: "Failed to fetch upcoming appointments" });
    }
  });

  app.patch("/api/appointments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(id, updates);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(400).json({ message: "Failed to update appointment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

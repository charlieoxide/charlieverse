import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Validate input
      const validatedData = insertUserSchema.parse({ username: email, password });
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create user
      const user = await storage.createUser({
        username: email,
        password: hashedPassword
      });
      
      // Store additional user info in session
      req.session.userId = user.id;
      req.session.userEmail = user.username;
      req.session.firstName = firstName;
      req.session.lastName = lastName;
      
      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.username,
          firstName,
          lastName
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await storage.getUserByUsername(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      req.session.userEmail = user.username;
      
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.username
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.session.userId) {
      res.json({
        id: req.session.userId,
        email: req.session.userEmail,
        firstName: req.session.firstName,
        lastName: req.session.lastName
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Quote request route
  app.post("/api/quotes", (req, res) => {
    try {
      const { projectType, budget, timeline, description, contactMethod } = req.body;
      
      // In a real app, you'd save this to a database
      const quote = {
        id: Date.now().toString(),
        userId: req.session.userId,
        userEmail: req.session.userEmail,
        projectType,
        budget,
        timeline,
        description,
        contactMethod,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      
      console.log("New quote request:", quote);
      
      res.status(201).json({
        message: "Quote request submitted successfully",
        quote
      });
    } catch (error) {
      console.error("Quote request error:", error);
      res.status(500).json({ message: "Failed to submit quote request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

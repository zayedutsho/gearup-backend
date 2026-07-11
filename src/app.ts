import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";

import config from "./config";

import { adminRoutes } from "./modules/admin/admin.route";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoute } from "./modules/category/category.route";
import { providerGearRoutes } from "./modules/gear/provideGear.route";
import { publicGearRoutes } from "./modules/gear/publicGear.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { providerRoutes } from "./modules/provider/provider.route";
import { rentalRoutes } from "./modules/rental/customerRental.route";
import { reviewRoutes } from "./modules/Review/review.route";

import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";

const app: Application = express();

// CORS
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// Stripe Webhook (must come BEFORE express.json)
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.send("Hello GearUp server");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoute);

app.use("/api/gear", publicGearRoutes);
app.use("/api/provider", providerGearRoutes);

app.use("/api/rentals", rentalRoutes);

app.use("/api/provider", providerRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/admin", adminRoutes);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

export default app;

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoute } from "./modules/category/category.route";
import { providerGearRoutes } from "./modules/gear/provideGear.route";
import { publicGearRoutes } from "./modules/gear/publicGear.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { providerRoutes } from "./modules/provider/provider.route";
import { rentalRoutes } from "./modules/rental/customerRental.route";

const app: Application = express();

//middleware
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello GearUp server");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoute);

app.use("/api/gear", publicGearRoutes);
app.use("/api/provider", providerGearRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/payments", paymentRoutes);

export default app;

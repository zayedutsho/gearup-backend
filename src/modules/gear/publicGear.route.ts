import { Router } from "express";
import { gearController } from "./gear.controller";

const router = Router();

// Public Routes

// GET /api/gear
router.get("/", gearController.getAllGear);

// GET /api/gear/:id
router.get("/:id", gearController.getSingleGear);

export const publicGearRoutes = router;

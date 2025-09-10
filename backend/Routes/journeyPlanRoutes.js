import express from "express";
import {
  createJourneyPlan,
  getJourneyPlans,
  updateJourneyPlan,
  deleteJourneyPlan
} from "../Controllers/journeyPlanController.js";

const router = express.Router();

// CRUD Routes for journey plans
router.get("/", getJourneyPlans);
router.post("/", createJourneyPlan);
router.put("/:id", updateJourneyPlan);
router.delete("/:id", deleteJourneyPlan);

export default router;

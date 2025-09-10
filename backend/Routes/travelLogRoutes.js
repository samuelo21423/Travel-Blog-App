import express from "express";
import {
  createTravelLog,
  getTravelLogs,
  updateTravelLog,
  deleteTravelLog,
} from "../Controllers/travelLogController.js";

const router = express.Router();

// CREATE
router.post("/", createTravelLog);

// READ
router.get("/", getTravelLogs);

// UPDATE
router.put("/:id", updateTravelLog);

// DELETE
router.delete("/:id", deleteTravelLog);

export default router;

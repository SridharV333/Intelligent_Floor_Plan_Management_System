// routes/floorPlanRoutes.js - Floor Plan Routes

const express = require("express");
const router = express.Router();
const authMiddleware = require("../utils/authMiddleware");
const {
  getAllFloorPlans,
  addFloorPlan,
  updateFloorPlan,
  deleteFloorPlan,
  syncFloorPlan
} = require("../controllers/floorPlanController");

// All routes require authentication
router.get("/floorplans", authMiddleware, getAllFloorPlans);
router.post("/add-floorplan", authMiddleware, addFloorPlan);
router.put("/update-floorplan/:id", updateFloorPlan);
router.delete("/delete-floorplan/:id", authMiddleware, deleteFloorPlan);
router.post("/floorplans/:id/sync", authMiddleware, syncFloorPlan);

module.exports = router;


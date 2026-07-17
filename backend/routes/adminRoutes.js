const express = require("express");
const Alert = require("../models/Alert");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, requireRole("admin"));

router.post("/alerts", async (req, res) => {
  try {
    const { message, severity } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const alert = await Alert.create({
      message,
      severity: severity || "info",
      createdBy: req.user._id
    });

    return res.status(201).json(alert);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.json(alerts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/alerts/:id/deactivate", async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    alert.active = false;
    await alert.save();

    return res.json(alert);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;



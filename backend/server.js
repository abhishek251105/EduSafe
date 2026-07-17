const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.send("Disaster Education API is running");
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/teacher", require("./routes/teacherRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

/* ---------------------------------------------------
   ROUTE INSPECTOR (View all routes)
   --------------------------------------------------- */
app.get("/routes", (req, res) => {
  const list = [];

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Direct route
      list.push({
        method: Object.keys(middleware.route.methods)[0].toUpperCase(),
        path: middleware.route.path,
      });
    } else if (middleware.name === "router") {
      // Router-level routes
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const base = middleware.regexp
            .toString()
            .replace("/^\\/", "/")
            .replace("\\/?(?=\\/|$)/i", "")
            .replace("/i", "")
            .replace(/^\/\^/, "")
            .replace(/\\\/\?\$\//, "");

          list.push({
            method: Object.keys(handler.route.methods)[0].toUpperCase(),
            path: base + handler.route.path,
          });
        }
      });
    }
  });

  res.json(list);
});

/* ---------------------------------------------------
   404 Handler
   --------------------------------------------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

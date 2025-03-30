import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize from "./config/database.js";
import User from "./models/user.js";
import Vehicle from "./models/vehicle.js";
import Bid from "./models/bid.js";
import Transaction from "./models/transaction.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(bodyParser.json());

// WebSocket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle new bid placement
  socket.on("placeBid", async (data) => {
    try {
      console.log(`New bid received: ${JSON.stringify(data)}`);

      const { vehicleName, bidAmount, userId } = data;

      if (!vehicleName || !bidAmount || !userId) {
        return socket.emit("bidError", { message: "Invalid bid data!" });
      }

      // Find the vehicle by name
      const vehicle = await Vehicle.findOne({ where: { name: vehicleName } });
      if (!vehicle) {
        return socket.emit("bidError", { message: "Vehicle not found!" });
      }

      // Store bid in MySQL with vehicle_name
      const newBid = await Bid.create({
        user_id: userId,
        vehicle_id: vehicle.id,
        bid_amount: parseFloat(bidAmount),
        vehicle_name: vehicleName, // Ensure this column exists in MySQL
      });

      console.log("✅ Bid stored successfully:", newBid.toJSON());

      // Store transaction in MySQL
      await Transaction.create({
        user_id: userId,
        vehicle_id: vehicle.id,
        amount: bidAmount,
        payment_status: "pending",
      });

      console.log("✅ Transaction stored successfully.");

      // Broadcast updated bid to all users
      io.emit("updateBid", { vehicleName, bidAmount });

    } catch (error) {
      console.error("❌ Error placing bid:", error);
      socket.emit("bidError", { message: "Error placing bid." });
    }
  });

  // Fetch bid history for a vehicle
  socket.on("getBidHistory", async (vehicleId) => {
    try {
      const bidHistory = await Bid.findAll({
        where: { vehicle_id: vehicleId },
        order: [["createdAt", "DESC"]],
      });

      socket.emit("bidHistory", bidHistory);
    } catch (error) {
      console.error("❌ Error fetching bid history:", error);
      socket.emit("bidError", { message: "Could not retrieve bid history." });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database synced (updated structure)");
  server.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
  });
});
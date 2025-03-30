import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Debugging: Print environment variables to check if they are loaded
console.log("DB Config:", {
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

const sequelize = new Sequelize(
  process.env.DB_NAME || "vehicle_auction",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "12345678",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql", // Fallback to "mysql" if not found
    logging: false, // Disable logging
  }
);

export default sequelize;


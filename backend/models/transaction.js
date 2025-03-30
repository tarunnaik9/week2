
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";
import Vehicle from "./vehicle.js";

const Transaction = sequelize.define("Transaction", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  vehicle_id: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  payment_status: { type: DataTypes.ENUM("pending", "completed", "failed"), defaultValue: "pending" },
});

Transaction.belongsTo(User, { foreignKey: "user_id" });
Transaction.belongsTo(Vehicle, { foreignKey: "vehicle_id" });

export default Transaction;

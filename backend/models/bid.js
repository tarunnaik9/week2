import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";
import Vehicle from "./vehicle.js";

const Bid = sequelize.define("Bid", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  vehicle_id: { type: DataTypes.INTEGER, allowNull: false },
  bid_amount: { type: DataTypes.FLOAT, allowNull: false },
  vehicle_name: { type: DataTypes.STRING, allowNull: false }, // ✅ Added this field
});

// Set up associations
Bid.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
Bid.belongsTo(Vehicle, { foreignKey: "vehicle_id", onDelete: "CASCADE" });

export default Bid;

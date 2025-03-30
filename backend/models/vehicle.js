import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";

const Vehicle = sequelize.define(
  "Vehicle",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("car", "bike", "truck"), allowNull: false },
    starting_price: { type: DataTypes.FLOAT, allowNull: false },
    bid_end_time: { type: DataTypes.DATE, allowNull: false },
  },
  {
    timestamps: false, // ✅ Disable timestamps (createdAt, updatedAt)
  }
);

Vehicle.belongsTo(User, { foreignKey: "user_id" });

export default Vehicle;

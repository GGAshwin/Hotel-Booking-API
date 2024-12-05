// connect.js
const { Sequelize } = require("sequelize");

const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcrypt");

// Using the full service URI
const sequelize = new Sequelize(
  "postgres://avnadmin:AVNS_xAQ4MVTZ4x-S7tPAIEC@postgres-online-ashwinprabhu2001-fd23.k.aivencloud.com:18505/defaultdb",
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // This option allows self-signed certificates
      },
    },
  }
);

async function connectAndSync() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // You can call sync on your models here if you want
    // await User.sync({ alter: true });
    // await Payment.sync({ alter: true });
    // await Feedback.sync({ alter: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

connectAndSync();

class Feedback extends Model {}

Feedback.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    hotel_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    traveler_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users", // The name of the table in the database
        key: "user_id",
      },
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize, // Pass the connection instance
    modelName: "Feedback",
    tableName: "feedback",
    timestamps: false, // Disable Sequelize's automatic timestamp handling
  }
);

module.exports = { connectAndSync, sequelize, Feedback };

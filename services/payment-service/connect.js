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

class Payment extends Model {}

Payment.init(
  {
    payment_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    traveler_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["CREDIT", "UPI"]],
      },
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [["COMPLETED", "FAILED", "IN_PROGRESS"]],
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize, // Use the imported sequelize instance
    modelName: "Payment",
    tableName: "payments",
    timestamps: false,
  }
);

module.exports = { connectAndSync, sequelize, Payment };

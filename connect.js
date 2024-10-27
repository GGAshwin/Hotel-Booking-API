// connect.js
const { Sequelize } = require("sequelize");

const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcrypt");

const sequelize = new Sequelize("BOOKING_DB", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
});

async function connectAndSync() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // You can call sync on your models here if you want
    // await User.sync({ alter: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

connectAndSync();

class User extends Model {
  // Method to compare passwords
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Generates UUID automatically
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("TRAVELER", "MANAGER"),
      allowNull: false,
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
    modelName: "User",
    tableName: "users",
    timestamps: false,
  }
);

module.exports = { connectAndSync, sequelize, User };

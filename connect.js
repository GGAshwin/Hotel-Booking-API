const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("BOOKING_DB", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
});

async function connect() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await Traveler.sync();
    console.log("The table for the traveler model was just (re)created!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

connect();

const { DataTypes } = require("sequelize");
const Traveler = sequelize.define(
  "Traveler",
  {
    traveler_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generates UUIDv4
      primaryKey: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Checks if the value is a valid email address
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 15], // Ensures phone number is between 10 and 15 characters
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Traveler", // Table name in the database
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = Traveler;

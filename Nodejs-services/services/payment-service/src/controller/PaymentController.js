const express = require("express");
const { connectAndSync, Payment } = require("../../connect");
const router = express.Router();
const Joi = require("joi");
const axios = require("axios");

// const USER_BASE_URL = "http://localhost:3000/api/users";
const USER_BASE_URL =
  "https://auth-service.cfapps.us10-001.hana.ondemand.com/api/users";
// const AUTH_BASE_URL = "http://localhost:3000/auth/verify";
const AUTH_BASE_URL =
  "https://auth-service.cfapps.us10-001.hana.ondemand.com/auth/verify";

const BOOKING_BASE_URL =
  "https://booking-service.cfapps.eu12.hana.ondemand.com/api/bookings";

// Connect to DB
connectAndSync();

// Middleware: Token Authentication
async function authenticateToken(req, res, next) {
  try {
    console.log(req.headers["authorization"]);

    const token = req.headers["authorization"]?.split(" ")[1];
    console.log(token);

    if (!token) {
      return res.status(403).json({ error: "No token provided" });
    }

    const verifyResponse = await axios.post(
      AUTH_BASE_URL,
      {},
      {
        headers: { Authorization: `${req.headers["authorization"]}` },
      }
    );

    if (verifyResponse.status !== 200) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = verifyResponse.data;
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    if (error.status === 401) {
      res.status(401).json({ error: "Invalid Token" });
      return;
    }
    res.status(500).json({ error: "Authentication failed" });
  }
}

// Middleware: Role Authorization
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
    }
    next();
  };
}

router.get(
  "/",
  authenticateToken,
  authorizeRoles("HOTEL_MANAGER", "TRAVELER"),
  async (req, res) => {
    const {
      payment_id,
      traveler_id,
      status,
      order_by = "created_at",
      order = "ASC",
    } = req.query;

    try {
      const whereClause = {};

      if (payment_id) whereClause.payment_id = payment_id;
      if (status) whereClause.status = status;

      if (req.user.role === "TRAVELER") {
        if (traveler_id && traveler_id !== req.user.userId) {
          return res
            .status(403)
            .json({ error: "You can only view your own payments." });
        }
        whereClause.traveler_id = req.user.userId;
      } else if (req.user.role === "HOTEL_MANAGER" && traveler_id) {
        whereClause.traveler_id = traveler_id;
      }

      const payments = await Payment.findAll({
        where: whereClause,
        attributes: [
          "payment_id",
          "traveler_id",
          "amount",
          "payment_method",
          "status",
          "created_at",
        ],
        order: [[order_by, order.toUpperCase()]],
      });

      if (!payments || payments.length === 0) {
        return res
          .status(404)
          .json({ error: "No payments found matching the criteria." });
      }

      res.status(200).json({
        payments,
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

// GET: Retrieve all payment statuses (HOTEL_MANAGER only)
router.get(
  "/status",
  authenticateToken,
  authorizeRoles("HOTEL_MANAGER"),
  async (req, res) => {
    try {
      const allPayments = await Payment.findAll({
        attributes: ["payment_id", "traveler_id", "status"],
      });

      res.status(200).json({ allPayments });
    } catch (error) {
      console.error("Error fetching payment statuses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// POST: Make a payment (TRAVELER only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("TRAVELER"),
  async (req, res) => {
    const { user_id, amount, payment_method } = req.body;

    const paymentSchema = Joi.object({
      user_id: Joi.string().required(),
      amount: Joi.number().positive().required(),
      payment_method: Joi.string().valid("CREDIT", "UPI").required(),
    });

    const { error } = paymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (req.user.userId !== user_id) {
      return res
        .status(403)
        .json({ error: "You can only make payments for your account" });
    }

    try {
      const userResponse = await axios.get(`${USER_BASE_URL}/${user_id}`, {
        headers: {
          Authorization: `${req.headers["authorization"]}`,
        },
      });
      if (!userResponse.data.user) {
        return res.status(400).json({ error: "User does not exist" });
      }

      const newPayment = await Payment.create({
        traveler_id: user_id,
        amount,
        payment_method,
        status: "IN_PROGRESS",
      });

      dummyPaymentProcess(newPayment, req.headers["authorization"]);

      res.status(201).json({
        payment_id: newPayment.payment_id,
        amount: newPayment.amount,
        payment_method: newPayment.payment_method,
        status: newPayment.status,
        created_at: newPayment.created_at,
      });
    } catch (err) {
      handleError(err, res);
    }
  }
);

// GET: Retrieve specific payment (TRAVELER or HOTEL_MANAGER)
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("HOTEL_MANAGER", "TRAVELER"),
  async (req, res) => {
    const { id: payment_id } = req.params;

    try {
      const payment = await Payment.findByPk(payment_id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      if (
        req.user.role === "TRAVELER" &&
        req.user.userId !== payment.traveler_id
      ) {
        return res.status(403).json({ error: "Access denied to this payment" });
      }

      res.status(200).json(payment);
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/:id/status",
  authenticateToken,
  authorizeRoles("HOTEL_MANAGER", "TRAVELER"),
  async (req, res) => {
    const { id: payment_id } = req.params;

    try {
      const payment = await Payment.findByPk(payment_id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      if (
        req.user.role === "TRAVELER" &&
        req.user.userId !== payment.traveler_id
      ) {
        return res.status(403).json({ error: "Access denied to this payment" });
      }

      res
        .status(200)
        .json({ payment_id: payment.payment_id, status: payment.status });
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET: Retrieve all payments for a traveler (HOTEL_MANAGER or TRAVELER)
router.get(
  "/traveler/:traveler_id",
  authenticateToken,
  authorizeRoles("HOTEL_MANAGER", "TRAVELER"),
  async (req, res) => {
    const { traveler_id } = req.params;

    if (req.user.role === "TRAVELER" && req.user.userId !== traveler_id) {
      return res.status(403).json({
        error: "You can only view your own payments",
      });
    }

    try {
      const payments = await Payment.findAll({
        where: { traveler_id },
        attributes: ["payment_id", "booking_id", "amount", "status"],
      });

      if (!payments.length) {
        return res.status(404).json({ error: "No payments found" });
      }

      res.status(200).json({ payments });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// POST: Retry a FAILED payment (TRAVELER only)
router.post(
  "/:id/retry",
  authenticateToken,
  authorizeRoles("TRAVELER"),
  async (req, res) => {
    const { id: payment_id } = req.params;

    try {
      const payment = await Payment.findByPk(payment_id);

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      if (req.user.userId !== payment.traveler_id) {
        return res.status(403).json({
          error: "You can only retry payments for your account",
        });
      }

      if (payment.status !== "FAILED") {
        return res.status(409).json({
          error: "Only payments in FAILED state can be retried",
        });
      }

      payment.status = "IN_PROGRESS";
      await payment.save();
      dummyPaymentProcess(payment);

      res.status(201).json({
        message: "Retry initiated",
        payment_id: payment.payment_id,
        status: payment.status,
      });
    } catch (error) {
      console.error("Error retrying payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Simulated Payment Processing
async function dummyPaymentProcess(payment, authHeader = "") {
  setTimeout(async () => {
    let booking_id;
    payment.status = Math.random() < 0.2 ? "FAILED" : "COMPLETED";
    await payment.save();
    // get the booking by payment
    try {
      const bookingDetails = await axios.get(`${BOOKING_BASE_URL}`, {
        headers: {
          Authorization: `${authHeader}`,
        },
      });
      console.log(bookingDetails);

      if (bookingDetails.length > 0) {
        let booking_obj = bookingDetails.filter((booking) => {
          return booking.payment_id === payment.payment_id;
        });

        if (booking_obj) {
          console.log(booking_obj);
          console.log("Booking id here");

          booking_id = booking_obj[0].id;
          console.log(booking_id);
          const putBooking = await axios.put(
            `${BOOKING_BASE_URL}/${booking_id}`,
            {
              id: booking_obj[0].id,
              hotelId: booking_obj[0].hotelId,
              travelerId: booking_obj[0].travelerId,
              roomType: booking_obj[0].roomType,
              price: booking_obj[0].price,
              checkIn: booking_obj[0].checkIn,
              checkOut: booking_obj[0].checkOut,
              status: booking_obj[0].status,
              paymentStatus: payment.status,
              paymentMethod: booking_obj[0].paymentMethod,
              paymentId: booking_obj[0].paymentId,
            },
            {
              headers: {
                Authorization: `${authHeader}`,
              },
            }
          );
          console.log("-----------------------Update happening");
          console.log(putBooking);
        }
      }
    } catch (error) {
      // res.status(500).json({ error: "Error from Booking Service" });
      console.error(error);
    }
    // update the payment status in booking
  }, 5000);
}

// Error Handling for Axios
function handleError(err, res) {
  if (err.response) {
    res.status(err.response.status).json({
      error: err.response.data.error || "Error from User Service",
    });
  } else if (err.request) {
    res.status(503).json({ error: "User Service unavailable" });
  } else {
    res.status(500).json({ error: "Unexpected server error" });
  }
}

module.exports = router;

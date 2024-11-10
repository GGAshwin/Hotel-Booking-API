const express = require("express");
const {
  connectAndSync,
  Payment,
  User,
  sequelize,
} = require("../../../../connect");
const { QueryTypes } = require("sequelize");
const router = express.Router();

connectAndSync();

// get all payments status
router.get("/status", async (req, res) => {
  let allPayments = await Payment.findAll({
    attributes: ["payment_id", "traveler_id", "status"],
  });

  res.status(200).json({
    allPayments,
  });
});

// make a payment
router.post("/", async (req, res) => {
  const { booking_id, user_id, amount, payment_method } = req.body;

  const existingUser = await User.findOne({ where: { user_id } });
  const existingBooking = await sequelize.query(
    "SELECT * from booking where id = ?",
    {
      replacements: [booking_id],
      type: QueryTypes.SELECT,
    }
  );

  if (!existingUser) {
    res.status(400).json({ error: "User does not exist" });
  }
  if (!existingBooking) {
    res.status(400).json({ error: "Booking does not exist" });
  }

  try {
    const newPayment = await Payment.create({
      booking_id: booking_id,
      traveler_id: user_id,
      amount,
      payment_method,
      status: "IN_PROGRESS",
    });

    dummyPaymentProcess(newPayment);

    res.status(201).json({
      booking_id: newPayment.booking_id,
      payment_id: newPayment.payment_id,
      amount: newPayment.amount,
      payment_method: newPayment.payment_method,
      status: newPayment.status,
      created_at: newPayment.created_at,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// get specific payment
router.get("/:id", async (req, res) => {
  const payment_id = req.params.id;

  const existingPayment = await Payment.findByPk(payment_id);

  if (!existingPayment) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }

  const status = existingPayment.status;
  const statusCode =
    status === "IN_PROGRESS"
      ? 202
      : status === "FAILED" || status === "COMPLETED"
      ? 200
      : statusCode;

  //   if (status === "IN_PROGRESS") {
  //     statusCode = 202;
  //   } else if (status === "FAILED") {
  //     statusCode = 200;
  //   } else if (status === "COMPLETED") {
  //     statusCode = 200;
  //   }

  res.status(statusCode).json({
    payment_id: existingPayment.payment_id,
    amount: existingPayment.amount,
    payment_method: existingPayment.payment_method,
    status: existingPayment.status,
    created_at: existingPayment.created_at,
  });
});

// get status of specific payment
router.get("/:id/status", async (req, res) => {
  const payment_id = req.params.id;

  const existingPayment = await Payment.findByPk(payment_id);
  if (!existingPayment) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }

  res.status(200).json({
    payment_id: existingPayment.payment_id,
    status: existingPayment.status,
  });
});

// get payments of a specific traveler
router.get("/traveler/:traveler_id", async (req, res) => {
  console.log("here----------------");

  const traveler_id = req.params.traveler_id;

  const traveler = await User.findByPk(traveler_id);
  if (!traveler) {
    res.status(404).json({ error: "Traveler Not Found!" });
    return;
  }

  const travelerPayments = await Payment.findAll({
    where: { traveler_id: traveler_id },
    attributes: ["payment_id", "booking_id", "amount", "status", "created_at"],
  });

  console.log(travelerPayments);

  if (!travelerPayments) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }

  res.status(200).json({
    travelerPayments,
  });
});

// retry a specific FAILED payment
router.post("/:id/retry", async (req, res) => {
  const payment_id = req.params.id;
  const existingPayment = await Payment.findByPk(payment_id);

  if (!existingPayment) {
    res.status(404).json({ error: "Payment not Found" });
    return;
  }
  dummyPaymentProcess(existingPayment);
});

async function dummyPaymentProcess(paymetObj) {
  const existingPayment = await Payment.findByPk(paymetObj.payment_id);
  setTimeout(() => {
    existingPayment.status =
      Math.floor(Math.random() * 5) === 0 ? "FAILED" : "COMPLETED";

    existingPayment.save();
  }, 10000);
}

module.exports = router;

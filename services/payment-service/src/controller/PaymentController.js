const express = require("express");
const { connectAndSync, Payment, User } = require("../../../../connect");
const router = express.Router();

connectAndSync();

router.post("/", async (req, res) => {
  const { booking_id, user_id, amount, payment_method } = req.body;

  const existingUser = await User.findOne({ where: { user_id } });
  //   same check for booking table

  if (!existingUser) {
    res.status(400).json({ error: "User does not exist" });
  }

  try {
    const newPayment = await Payment.create({
      traveler_id: user_id,
      amount,
      payment_method,
      status: "IN_PROGRESS",
    });

    dummyPaymentProcess(newPayment);

    res.status(201).json({
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

router.get("/:id", async (req, res) => {
  const payment_id = req.params.id;

  const existingPayment = await Payment.findByPk(payment_id);

  if (!existingPayment) {
    res.status(404).json({ error: "Payment not found" });
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

router.get("/:id/status", async (req, res) => {
  const payment_id = req.params.id;

  const existingPayment = await Payment.findByPk(payment_id);
  if (!existingPayment) {
    res.status(404).json({ error: "Payment not found" });
  }

  res.status(200).json({
    payment_id: existingPayment.payment_id,
    status: existingPayment.status,
  });
});

async function dummyPaymentProcess(paymetObj) {
  const existingPayment = await Payment.findByPk(paymetObj.payment_id);
  setTimeout(() => {
    existingPayment.status =
      Math.floor(Math.random() * 5) === 0 ? "FAILED" : "COMPLETED";

    existingPayment.save();
  }, 5000);
}

module.exports = router;

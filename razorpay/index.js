const express = require("express");
const razorpay = require("razorpay");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hi");
});

app.post("/order", async (req, res) => {
  const amount = req.body.amount;

  var instance = new Razorpay({
    key_id: "YOUR_KEY_ID",
    key_secret: "YOUR_SECRET",
  });

  var options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt#1",
  };

  const myOrder = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    amount,
    order: myOrder,
  });
});

app.listen(4000, () => {
  console.log("listening on port 4000...");
});

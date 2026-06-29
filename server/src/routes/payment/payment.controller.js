const {
  paymentIntentCreated,
  paymentIntentSucceeded,
  paymentIntentFailed,
  paymentIntentCanceled,
} = require("./webhooks");

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { updateOrder } = require("../../models/orders/orders.data");

const endpointSecret = process.env.STRIPE_END_POINT_SECRET;

const calculateOrderAmount = (items) => {
  const total = items.reduce(
    (acc, item) => acc + item.pricing * item.quantity,
    0
  );
  // const total = total + shipping
  // const total = total * tax
  return total * 100;
};

const httpPaymentIntent = async (req, res) => {
  const user = req.user;
  const { products, orderId } = req.body;
  if (!user) return res.status(401).send("Must be logged in!");
  if (products.length === 0) return res.status(400).send("No products");
  try {
    // check if order already exists (this could be its own function)
    // This
    const order = await paymentIntentCreated(
      {
        user: user.gid,
        total: calculateOrderAmount(products),
        products: products,
      },
      orderId
    );
    if (order?.error) {
      return res.status(400).send(order.error);
    }
    const newOrderId = order._id.toString();

    if (newOrderId === orderId) {
      return res.status(200).send({
        clientSecret: res.order.clientSecret,
        orderId: newOrderId,
      });
    }

    // if does not exist create new paymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.total,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: newOrderId,
      },
    });

    await updateOrder(order._id, {
      stripeClientSecret: paymentIntent.client_secret,
    });
    return res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: newOrderId,
    });
  } catch (err) {
    console.log(err);
    paymentIntentCanceled({ metadata: { orderId: orderId } });
    res.status(500).send(err);
  }
};

const httpWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  const eventObj = event.data.object;
  switch (event.type) {
    case "payment_intent.canceled":
      paymentIntentCanceled(eventObj);
      break;
    case "payment_intent.succeeded":
      paymentIntentSucceeded(eventObj);
      break;
    case "payment_intent.failed":
      paymentIntentFailed(eventObj);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

module.exports = {
  httpPaymentIntent,
  httpWebhook,
};

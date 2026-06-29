const { sendMail } = require("../../utils/mailer");
const {
  updateOrder,
  deleteOrder,
  getOrder,
  createOrder,
} = require("../../models/orders/orders.data");
const { getUser } = require("../../models/user/user.data");
const { lockItems, assignItems, unlockItems } = require("./webhooks.helper");

const paymentIntentCreated = async (order, orderId) => {
  try {
    const fetchedOrder = await getOrder(orderId);
    const timeDifference = Date.now() - fetchedOrder.date;
    if (
      fetchedOrder.status !== "pending" ||
      timeDifference > 5 * 60 * 1000 ||
      fetchedOrder.products !== order.products
    ) {
      if (fetchedOrder.status === "pending") {
        unlockItems(fetchedOrder._id);
        deleteOrder(fetchedOrder._id);
      }
      throw new Error("Order conditions not met.");
    }
    return fetchedOrder;
  } catch (err) {
    console.log(err);
  }

  // Locks the items and creates the order
  try {
    const products = await lockItems(order.products);
    if (products.length === 0) {
      throw new Error("Out of Stock");
    }
    order.products = products;
    const createdOrder = await createOrder(order);
    return createdOrder;
  } catch (err) {
    return { error: "Out of Stock" };
  }
};

const paymentIntentSucceeded = async (event) => {
  const { metadata, shipping } = event;
  const { orderId } = metadata;
  try {
    const updaedOrder = await assignItems(orderId);
    updaedOrder.status = "processing";
    updaedOrder.shipping = shipping;
    await updateOrder(orderId, updaedOrder);
    // UPDATE LATER
    sendMail(
      user.email,
      "Order Confirmation",
      "Your order has been confirmed. We are processing it soon and will send tracking number."
    );
    sendMail("blueprint.creationsco@gmail.com", "New Order Recieved!");
    console.log(
      "Payment Intent Succeeded -------------------------------------------"
    );
  } catch (err) {
    console.log(err);
  }
};

const paymentIntentFailed = async (event) => {
  const { metadata } = event;
  const { orderId } = metadata;
  try {
    const order = await getOrder(orderId);
    const user = await getUser(order.user);
    order.status = "failed";
    await updateOrder(orderId, order);
    // UPDATE LATER
    sendMail(
      user.email,
      "Order Failed",
      "Your payment was unsuccessful. Please try again."
    );
    console.log(
      "Payment Intent Failed -------------------------------------------"
    );
  } catch (err) {
    console.log(err);
  }
};

// Later on update this to remove holder on the items
const paymentIntentCanceled = async (event) => {
  const { metadata } = event;
  const { orderId } = metadata;
  try {
    await unlockItems(orderId);
    await deleteOrder(orderId);
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Payment Intent Canceled -------------------------------------------"
  );
};

module.exports = {
  paymentIntentCreated,
  paymentIntentSucceeded,
  paymentIntentFailed,
  paymentIntentCanceled,
};

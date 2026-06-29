const { parse } = require("path");
const {
  getProduct,
  updateProduct,
} = require("../../models/product/product.data");
const { getUser, updateUser } = require("../../models/user/user.data");
const { getOrder } = require("../../models/orders/orders.data");

async function unlockItems(orderId) {
  const order = await getOrder(orderId);
  for (let productBought of order.products) {
    const product = await getProduct(productBought.name);
    const { name, items } = productBought;
    for (let i = 0; i < product.items.length; i++) {
      const item = product.items[i];
      const itemId = String(item._id);
      if (items.includes(itemId)) {
        product.items[i].owner = null;
      }
    }
    await updateProduct(name, product);
  }
  return order;
}

async function lockItems(products) {
  const orderProducts = [];

  for (let product of products) {
    const fetchProduct = await getProduct(product.name);
    const { _id, name, images, pricing, items } = fetchProduct;
    let quantity = product.quantity;
    const orderItems = [];
    const parsedProduct = {
      product: String(_id),
      name,
      pricing,
      size: product.size,
      image: images[0],
      items: [],
    };
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.size === product.size && !item.owner) {
        quantity -= 1;
        fetchProduct.items[i].owner = "locked";
        orderItems.push(String(item._id));
      }
      if (quantity === 0) {
        parsedProduct.items = orderItems;
        orderProducts.push(parsedProduct);
        await updateProduct(name, fetchProduct);
        break;
      }
    }

    // if there were no items left in stock unlock items
    // we can improve them and notify only x amount were left and if they want it
    if (quantity > 0) {
      await unlockItems(orderProducts);
      return [];
    }
  }
  return orderProducts;
}

async function assignItems(orderId) {
  const order = await getOrder(orderId);
  const updatedUser = await getUser(order.user);
  for (let productBought of order.products) {
    const product = await getProduct(productBought.name);
    const { name, items } = productBought;
    for (let i = 0; i < product.items.length; i++) {
      const item = product.items[i];
      const itemId = String(item._id);
      if (items.includes(itemId)) {
        product.items[i].owner = updatedUser.gid;
        updatedUser.items.push({ product: name, item: itemId });
      }
    }
    await updateProduct(name, product);
  }
  await updateUser(updatedUser);
  return order;
}

module.exports = { lockItems, assignItems, unlockItems };

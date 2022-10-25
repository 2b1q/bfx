const { CMD_STATUS, BASE_REPLAY } = require("../dht/dht");

function handleNewOrder(payload, handler, orderBook) {
  if (payload.order) {
    const { order } = payload;

    orderBook.addOrder(order);

    return handler.reply(null, {
      ...BASE_REPLAY,
      order,
    });
  }

  return handler.reply(null, {
    status: CMD_STATUS.FAILED,
    order: null,
    error: "Empty order",
  });
}

function listOrders(handler, orderBook) {
  return handler.reply(null, {
    ...BASE_REPLAY,
    orders: orderBook.listOrders(),
  });
}

module.exports = { handleNewOrder, listOrders };

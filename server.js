"use strict";

const { DhtRpc, CMD_STATUS } = require("./components/dht/dht");
const { OrderBook, ORDER_CMD } = require("./components/orders/order-book");

const {
  handleNewOrder,
  listOrders,
} = require("./components/orders/order-handlers");

const dht = new DhtRpc();
const service = dht.newRpcService();

const orderBook = new OrderBook();

setInterval(function () {
  dht.link.announce("rpc_orders", service.port, {});
}, 1000);

service.on("request", (rid, key, payload, handler) => {
  console.log({ rid, key, payload });

  try {
    switch (payload.cmd) {
      case ORDER_CMD.NEW:
        return handleNewOrder(payload, handler, orderBook);
      case ORDER_CMD.LIST:
        return listOrders(handler, orderBook);

      default:
        break;
    }
  } catch (error) {
    console.error(error);
    return handler.reply(null, { status: CMD_STATUS.FAILED, error });
  }

  handler.reply(null, {
    status: CMD_STATUS.FAILED,
    error: "unhandled operation",
  });
});

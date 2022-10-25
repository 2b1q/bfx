const { v4: uuidv4 } = require("uuid");

const ORDER_CMD = {
  NEW: "new_order",
  LIST: "list_orders",
};

const ORDER_TYPE = {
  SELL: "SELL",
  BUY: "BUY",
};

class OrderBook {
  constructor() {
    this.book = {};
  }

  /**
   *
   * @param {string} type SELL
   * @param {number} price 1300.12
   * @param {number} qty 2
   * @param {string} symbol 'WETH-USDT'
   * @returns
   */
  newOrder(type, price, qty, symbol, id) {
    const newOrderId = id || uuidv4();

    this.book = {
      ...this.book,
      [newOrderId]: {
        id: newOrderId,
        type,
        price,
        qty,
        symbol,
      },
    };

    console.table(this.book);

    return this.book[newOrderId];
  }

  addOrder(order) {
    if (!order) return null;

    if (order.id && this.book[order.id]) {
      console.log(`OrderId ${order.id} exists`);
      return this.book[order.id];
    }

    const { id, type, price, qty, symbol } = order;
    return this.newOrder(type, price, qty, symbol, id);
  }

  listOrders() {
    return this.book;
  }

  registerDistributedOrder(order, peerClient) {
    return new Promise((res, rej) => {
      peerClient.request(
        "rpc_orders",
        { cmd: ORDER_CMD.NEW, order },
        { timeout: 10000 },
        (err, data) => {
          if (err) return rej(err);

          res(data);
        }
      );
    });
  }
}

module.exports = { OrderBook, ORDER_CMD, ORDER_TYPE };

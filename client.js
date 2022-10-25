"use strict";

const { DhtRpc } = require("./components/dht/dht");
const {
  OrderBook,
  ORDER_CMD,
  ORDER_TYPE,
} = require("./components/orders/order-book");

const dhtClient = new DhtRpc();
const peerClient = dhtClient.newClientPeer();

let serverOrderBook;
const orderBook = new OrderBook();

setInterval(() => {
  peerClient.request(
    "rpc_orders",
    { cmd: ORDER_CMD.LIST },
    { timeout: 1000 },
    (err, data) => {
      if (err) return null;

      serverOrderBook = data.orders;
      console.log("========= Server orders =========");
      console.table(serverOrderBook);

      console.log("========= My orders =========");
      console.table(orderBook.listOrders());
    }
  );
}, 2000);

const newRandOrder = getRandOrder();
const order = orderBook.newOrder(
  newRandOrder.type,
  newRandOrder.price,
  newRandOrder.qty,
  newRandOrder.symbol
);

(async () => {
  try {
    const registeredOrder = await orderBook.registerDistributedOrder(
      order,
      peerClient
    );

    console.log("Order has been registered: ", registeredOrder);
  } catch (err) {
    console.error(err);
  }
})();

function getRandOrder() {
  const pairs = ["WETH-USDT", "CRV-USDT", "WBTC-WETH"];
  const type = [ORDER_TYPE.SELL, ORDER_TYPE.BUY];

  const MIN_PRICE = 1;
  const MAX_PRICE = 15000;

  const MIN_QTY = 1;
  const MAX_QTY = 10000;

  return {
    symbol: pairs[Math.floor(Math.random() * pairs.length)],
    type: type[Math.floor(Math.random() * type.length)],
    price: Math.random() * (MAX_PRICE - MIN_PRICE) + MIN_PRICE,
    qty: getRandomInt(MIN_QTY, MAX_QTY),
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

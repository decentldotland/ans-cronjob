import express from "express";
import cors from "cors";

import { getExpiredOrders, cancelOrder, sleep } from "./utils/exm.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);

app.get("/refresh", async (req, res) => {
  try {
    const orders = await getExpiredOrders();
    for (const order of orders) {
      await cancelOrder(order.id);
    }
    res.send(orders);
    res.end();
  } catch (error) {
    res.send({ error: "error oops!" });
    res.end();
  }
});

app.listen(port, async () => {
  console.log(`listening at PORT: ${port}`);
  await polling();
});

async function polling() {
  try {
    while (true) {
      const orders = await getExpiredOrders();
      for (const order of orders) {
        await cancelOrder(order.id);
      }

      await sleep(30);
    }
  } catch (error) {
    console.log(error);
    await sleep(5);
  }
}

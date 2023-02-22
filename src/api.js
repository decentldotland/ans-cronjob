import { getExpiredOrders, cancelOrder, sleep } from "./utils/exm.js";

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

polling();
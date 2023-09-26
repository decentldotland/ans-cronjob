import { ANS_CONTRACT_ADDRESS } from "./constants.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function getExpiredOrders() {
  try {
    const state = (
      await axios.get(`https://api.mem.tech/api/state/${ANS_CONTRACT_ADDRESS}`)
    )?.data;
    const expiredOrders = state.marketplace.filter(
      (order) => order.status === "open" && order.expiry < new Date().getTime()
    );
    console.log(expiredOrders);
    return expiredOrders;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function cancelOrder(order_id) {
  try {
    const inputs = [{ input: { function: "cancelOrder", id: order_id } }];
    const interaction = await axios.post(
      "https://api.mem.tech/api/transactions",
      {
        functionId: ANS_CONTRACT_ADDRESS,
        inputs: inputs,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log(`canceled order_id: ${order_id} via ${interaction?.data?.pseudoId}\n`);

  } catch (error) {
    console.log(error);
  }
}

export function sleep(minutes) {
  const milliseconds = minutes * 60 * 1000;
  console.log(`\nsleeping for ${minutes} min\n`);
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}



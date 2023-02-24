import { ANS_CONTRACT_ADDRESS } from "./constants.js";
import { Exm } from "@execution-machine/sdk";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const exm = new Exm({ token: process.env.EXM_API_TOKEN });

export async function getExpiredOrders() {
  try {
    const state = (
      await axios.get(`https://api.exm.dev/read/${ANS_CONTRACT_ADDRESS}`)
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
    const inputs = [{ function: "cancelOrder", id: order_id }];

    const interaction = await exm.functions.write(ANS_CONTRACT_ADDRESS, inputs);
    console.log(`canceled order_id: ${order_id} via ${interaction?.data?.pseudoId}\n`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function sleep(minutes) {
  const milliseconds = minutes * 60 * 1000;
  console.log(`\nsleeping for ${minutes} min\n`);
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

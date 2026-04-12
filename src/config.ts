import dotenv from "dotenv";

dotenv.config();

const { BOT_TOKEN, BOT_ID } = process.env;

if (!BOT_TOKEN || !BOT_ID) {
  throw new Error("Missing envioronment vars");
}

export const config = {
  BOT_TOKEN,
  BOT_ID
}
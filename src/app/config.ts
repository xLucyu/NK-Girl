import dotenv from "dotenv";

dotenv.config();

function validate(varName: string): string {

  const value = process.env[varName];

  if (!value) throw new Error(`Missing var: ${varName}`);

  return value;
}

export const CONFIG = {
  BOT_TOKEN: validate("BOT_TOKEN"),
  BOT_ID: validate("BOT_ID"),
  OWNER_ID: validate("OWNER_ID"),
  HOST: validate("HOST"),
  PORT: validate("PORT"),
  DATABASE: validate("DATABASE"),
  USER: validate("USER"),
  PASSWORD: validate("PASSWORD"),
  SUBMISSION_CHANNEL: validate("SUBMISSION_CHANNEL"),
  WEBHOOK_URL: validate("WEBHOOK_URL"),
  SERVICE_ACCOUNT: validate("SERVICE_ACCOUNT"),
  BUCKET: validate("BUCKET")
};
import dotenv from "dotenv";

dotenv.config();

function validate(varName: string): string {

  const value = process.env[varName];

  if (!value) throw new Error(`Missing var: ${varName}`);

  return value;
}


export const config = {
  BOT_TOKEN: validate("BOT_TOKEN"),
  BOT_ID: validate("BOT_ID"),
  OWNER_ID: validate("OWNER_ID"),
  HOST: validate("HOST"),
  PORT: validate("PORT"),
  DATABASE: validate("DATABASE"),
  USER: validate("USER"),
  PASSWORD: validate("PASSWORD")
};
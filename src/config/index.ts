import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connection_string: process.env.CONNECTION_STRING as string,
  port: process.env.PORT,
  access_token_secret: process.env.JWT_SECRET,
  access_token_expire: process.env.EXCESS_TOKEN_EXPIRE,
};

export default config;

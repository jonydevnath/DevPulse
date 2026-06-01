import app from "./app";
import config from "./config";
import { initDB } from "./DB";

const port = config.port

const main = () => {
  initDB();
  app.listen(port, () => {
  console.log(`DevPulse app listening on port ${port}`)
})
}

main();
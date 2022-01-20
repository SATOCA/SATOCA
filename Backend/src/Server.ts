// import "reflect-metadata";
import app from "./App"
// database configuration
import {createConnection, getConnection} from "typeorm";
import * as connectionOptions from "./ormconfig";
import logger from "./logging/Logger";

export const connectDB = async () => {
  await createConnection(connectionOptions);
};

const port = Number(process.env.APP_PORT) || 5000;
const startServer = async () => {
  //! \todo logger
  app.listen(port, () => logger.info(`> Listening on port ${port}`));
};

(async () => {
  await connectDB();
  await startServer();
})();

import "reflect-metadata";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { MainRouter } from "./routers/MainRouter";
import ErrorHandler from "./models/ErrorHandler";

// load the environment variables from the .env file
dotenv.config({
  path: ".env",
});

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class Server {
  public app = express();
  public router = new MainRouter().router;
}

// setup database connection
createConnection({
  type: "postgres",
  host: process.env.DATABASE_HOST!,
  port: 5432, //! \todo convert process.env.DATABASE_PORT to number
  username: process.env.DATABASE_USERNAME!,
  database: process.env.DATABASE_NAME!,
  synchronize: true,
  logging: false,
  entities: ["src/entities/**/*.ts"],
}).then(async (connection) => {
  // initialize server app
  const server = new Server();

  server.app.use("/api", server.router);

  // make server app handle any error
  server.app.use(
    (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
      res.status(err.statusCode || 500).json({
        status: "error",
        statusCode: err.statusCode,
        message: err.message,
      });
    }
  );

  // make server listen on some port
  ((port = process.env.APP_PORT || 5000) => {
    server.app.listen(port, () => console.log(`> Listening on port ${port}`));
  })();
});


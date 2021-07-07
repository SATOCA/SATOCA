import "reflect-metadata";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";

import { MainRouter } from "./routers/MainRouter";
import ErrorHandler from "./models/ErrorHandler";

import { Survey } from "./entities/Survey";
import { Participant } from "./entities/Participant";
import { Question } from "./entities/Question";
import { Answer } from "./entities/Answer";
import { Trustee } from "./entities/Trustee";
import { FinishedQuestion } from "./entities/FinishedQuestion";

// load the environment variables from the .env file
dotenv.config({
  path: ".env",
});

// setup database connection
createConnection({
  type: "postgres",
  host: process.env.DATABASE_HOST!,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  synchronize: true,
  logging: false,
  entities: [Survey, Participant, Question, Answer, FinishedQuestion, Trustee],
}).then(async () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(
    fileUpload({
      createParentPath: true,
      useTempFiles: true,
      tempFileDir: "/tmp/",
      debug: true, //todo remove this after dev
    })
  );

  const router = new MainRouter().router;

  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    // res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  app.use("/api", router);

  // make server app handle any error
  app.use((err: ErrorHandler, req: Request, res: Response) => {
    res.status(err.statusCode || 500).json({
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
    });
  });

  // make server listen on some port
  ((port = process.env.APP_PORT || 5000) => {
    app.listen(port, () => console.log(`> Listening on port ${port}`));
  })();
});

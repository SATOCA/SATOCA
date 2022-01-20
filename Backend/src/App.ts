import "reflect-metadata";
import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
// logging
import morganConfig from './logging/MorganConfig'

import { MainRouter } from "./routers/MainRouter";
import ErrorHandler from "./models/ErrorHandler";

const app = express();
app.use(bodyParser.json());
// add logger middleware
app.use(morganConfig);

app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: '/tmp/',
    debug: true, //todo remove this after dev
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
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

const router = new MainRouter().router;
app.use("/api", router);

// make server app handle any error
app.use((err: ErrorHandler, req: Request, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: "error",
    statusCode: err.statusCode,
    message: err.message,
  });
});

export default app;
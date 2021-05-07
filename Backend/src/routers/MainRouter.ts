import { Router } from "express";
import SurveyRouter from "./SurveyRouter";

class MainRouter {
  private _router = Router();
  private _surveyRouter = SurveyRouter;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    this._router.use("/survey", this._surveyRouter);
  }
}

export = new MainRouter().router;

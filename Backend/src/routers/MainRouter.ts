import { Router } from "express";
import { SurveyRouter } from "./SurveyRouter";
import { TrusteeRouter } from "./TrusteeRouter";

export class MainRouter {
  private _router = Router();
  private _surveyRouter = new SurveyRouter().router;
  private _trusteeRouter = new TrusteeRouter().router;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  private _configure() {
    this._router.use("/survey", this._surveyRouter);
    this._router.use("/trustee", this._trusteeRouter);
  }
}

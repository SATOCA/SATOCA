import { Router } from "express";
import { ParticipantRouter } from "./ParticipantRouter";
import { SurveyRouter } from "./SurveyRouter";

class MainRouter {
  private _router = Router();
  private _surveyRouter = new SurveyRouter().router;
  private _participantRouter = new ParticipantRouter().router;

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
    this._router.use("/participant", this._participantRouter);
  }
}

export = new MainRouter().router;

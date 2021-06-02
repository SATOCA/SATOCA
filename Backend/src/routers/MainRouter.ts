import { Router } from "express";
import { ParticipantRouter } from "./ParticipantRouter";
import { QuestionRouter } from "./QuestionRouter";
import { SurveyRouter } from "./SurveyRouter";

export class MainRouter {
  private _router = Router();
  private _surveyRouter = new SurveyRouter().router;
  private _participantRouter = new ParticipantRouter().router;
  private _questionRouter = new QuestionRouter().router;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  private _configure() {
    this._router.use("/survey", this._surveyRouter);
    this._router.use("/participant", this._participantRouter);
    this._router.use("/question", this._questionRouter);
  }
}

import { NextFunction, Request, Response, Router } from "express";
import { SurveyController } from "../controllers/SurveyController";
import { SurveyDto } from "./dto/SurveyDto";
import { AnswerSurveyDto } from "./dto/AnswerSurveyDto";
import ErrorHandler from "../models/ErrorHandler";
export class SurveyRouter {
  private _router = Router();
  private _controller = new SurveyController();

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  private static extractUrlParams(
    req: Request
  ): { surveyId: number; uniqueId: number } {
    if (!(req.params && req.params.surveyId && req.params.uniqueId))
      throw new ErrorHandler(400, "Parameters invalid");

    let surveyId = Number(req.params.surveyId);
    let uniqueId = Number(req.params.uniqueId);

    if (isNaN(surveyId) || isNaN(uniqueId))
      throw new ErrorHandler(400, "Parameters invalid");

    return { surveyId, uniqueId };
  }

  private _configure() {
    this._router.get(
      "/all",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller.getSurveys().then(obj => { res.status(200).json(obj); });
        } catch (error) {
          next(error);
        }
      }
    );

    this._router.post(
      "",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller.addSurvey(req.body as SurveyDto).then(obj => { res.status(200).json(obj); });
        } catch (error) {
          next(error);
        }
      }
    );

    this._router.get(
      "/:surveyId/:uniqueId",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller.getCurrentSurvey(Number(req.params.surveyId), req.params.uniqueId).then(obj => { res.status(200).json(obj); });

        } catch (error) {
          next(error);
        }
      }
    );

    this._router.post(
      "/:surveyId/:uniqueId",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          let { surveyId, uniqueId } = SurveyRouter.extractUrlParams(req);

          const result = this._controller.postCurrentSurvey(
            req.body as AnswerSurveyDto,
            surveyId,
            uniqueId
          );
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

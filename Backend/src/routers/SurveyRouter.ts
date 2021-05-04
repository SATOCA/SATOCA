import { NextFunction, Request, Response, Router } from "express";
import SurveyController from "../controllers/SurveyController";
import { AnswerSurveyDto } from "./dto/AnswerSurveyDto";
import ErrorHandler from "../models/ErrorHandler";

class SurveyRouter {
  private _router = Router();
  private _controller = SurveyController;

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

    if (!isNaN(surveyId) || !isNaN(uniqueId))
      throw new ErrorHandler(400, "Parameters invalid");

    return { surveyId, uniqueId };
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private _configure() {
    this._router.get(
      "/:surveyId/:uniqueId",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          let { surveyId, uniqueId } = SurveyRouter.extractUrlParams(req);

          const result = this._controller.getCurrentSurvey(surveyId, uniqueId);
          res.status(200).json(result);
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

export = new SurveyRouter().router;
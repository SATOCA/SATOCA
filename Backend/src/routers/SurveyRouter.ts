import { NextFunction, Request, Response, Router } from "express";
import { SurveyController } from "../controllers/SurveyController";
import { SurveyDto } from "./dto/SurveyDto";
import { AnswerSurveyDto } from "./dto/AnswerSurveyDto";

export class SurveyRouter {
  private _router = Router();
  private _controller = new SurveyController();

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  private _configure() {
    this._router.get(
      "/all",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller.getSurveys().then((obj) => {
            res.status(200).json(obj);
          });
        } catch (error) {
          next(error);
        }
      }
    );

    this._router.get(
      "/:surveyId/:uniqueId",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller
            .getCurrentSurvey(Number(req.params.surveyId), req.params.uniqueId)
            .then((obj) => {
              res.status(200).json(obj);
            });
        } catch (error) {
          next(error);
        }
      }
    );

    this._router.post("", (req: Request, res: Response, next: NextFunction) => {
      try {
        this._controller.addSurvey(req.body as SurveyDto).then((obj) => {
          res.status(200).json(obj);
        });
      } catch (error) {
        next(error);
      }
    });

    this._router.post(
      "/:surveyId/:uniqueId",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller
            .postCurrentSurvey(
              req.body as AnswerSurveyDto,
              Number(req.params.surveyId),
              req.params.uniqueId
            )
            .then((obj) => {
              res.status(200).json(obj);
            });
        } catch (error) {
          next(error);
        }
      }
    );

    this._router.post(
      "/file",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller.createSurveyFromFile(req.files).then(() => {
            res.status(200);
          });
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

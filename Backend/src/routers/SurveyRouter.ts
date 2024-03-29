import { NextFunction, Request, Response, Router } from "express";
import { SurveyController } from "../controllers/SurveyController";
import { AnswerSurveyDto } from "./dto/AnswerSurveyDto";
import { ErrorDto } from "./dto/ErrorDto";
import fileUpload from "express-fileupload";
import { UploadSurveyFileDto } from "./dto/UploadSurveyFileDto";
import { CloseSurveyDto } from "./dto/CloseSurveyDto";
import { TrusteeDto } from "./dto/TrusteeDto";
import { SurveyProgressDto } from "./dto/SurveyProgressDto";
import { GetReportDto } from "./dto/GetReportDto";

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
      "/data/:surveyId/:uniqueId",
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

    this._router.get(
      "/disclaimer/:surveyId",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller
            .getLegalDisclaimer(Number(req.params.surveyId))
            .then((obj) => {
              res.status(200).json(obj);
            });
        } catch (error) {
          next(error);
        }
      }
    );

    this._router.post(
      "/accept-disclaimer/:participantId",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller
            .acceptLegalDisclaimer(req.params.participantId)
            .then((obj) => {
              res.status(200).json(obj);
            });
        } catch (error) {
          next(error);
        }
      }
    );

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
      "/upload",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          if (!req.files) {
            const noFileResponse: ErrorDto = {
              message: "There is no file",
              hasError: true,
            };
            res.status(400).json(noFileResponse);
          } else {
            const file = req.files.file as fileUpload.UploadedFile;

            this._controller
              .createSurveyFromFile(file, req.body as UploadSurveyFileDto)
              .then((obj) => {
                res.status(200).json(obj);
              });
          }
        } catch (error) {
          next(error);
        }
      }
    );

    this._router.post(
      "/get-reports",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller.getReports(req.body as GetReportDto).then((obj) => {
            res.status(200).json(obj);
          });
        } catch (error) {
          next(error);
        }
      }
    );

    this._router.post(
      "/get-progress",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller
            .getProgress(req.body as SurveyProgressDto)
            .then((obj) => {
              res.status(200).json(obj);
            });
        } catch (error) {
          next(error);
        }
      }
    );

    //todo: change to GET endpoint
    this._router.post(
      "/get-surveys",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller.getAllSurveys(req.body as TrusteeDto).then((obj) => {
            res.status(200).json(obj);
          });
        } catch (error) {
          next(error);
        }
      }
    );

    this._router.post(
      "/close-survey",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller
            .closeSurvey(req.body as CloseSurveyDto)
            .then((obj) => {
              res.status(200).json(obj);
            });
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

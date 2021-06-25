import { NextFunction, Request, Response, Router } from "express";
import { ParticipantController } from "../controllers/ParticipantController";
import {ParticipantDto} from "./dto/ParticipantDto";

export class ParticipantRouter {
  private _router = Router();
  private _controller = new ParticipantController();

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  private _configure() {
    this._router.get(
      "/:surveyId",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller.getParticipants(Number(req.params.surveyId)).then(obj => { res.status(200).json(obj); });;

        } catch (error) {
          next(error);
        }
      }
    );
    this._router.post(
      "/:surveyId",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller.postParticipant(Number(req.params.surveyId)).then(obj => { res.status(200).json(obj); });;

        } catch (error) {
          next(error);
        }
      }
    );
    this._router.post("", (req: Request, res: Response, next: NextFunction) => {
        try {
            this._controller.addParticipant(req.body as ParticipantDto).then((obj) => {
                res.status(200).json(obj);
            });
        } catch (error) {
            next(error);
        }
    });
  }
}

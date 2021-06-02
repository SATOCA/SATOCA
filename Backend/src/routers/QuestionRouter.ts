import { NextFunction, Request, Response, Router } from "express";
import { QuestionController } from "../controllers/QuestionController";
import { QuestionDto } from "./dto/QuestionDto";

export class QuestionRouter {
   private _router = Router();
   private _controller = new QuestionController();

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
               this._controller.getQuestions(Number(req.params.surveyId)).then(obj => { res.status(200).json(obj); });;

            } catch (error) {
               next(error);
            }
         }
      );
      this._router.post(
         "/:surveyId",
         (req: Request, res: Response, next: NextFunction) => {
            try {
               this._controller.postQuestion(Number(req.params.surveyId), req.body as QuestionDto).then(obj => { res.status(200).json(obj); });;

            } catch (error) {
               next(error);
            }
         }
      );
   }
}


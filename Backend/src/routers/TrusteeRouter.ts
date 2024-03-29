import { NextFunction, Request, Response, Router } from "express";
import { TrusteeController } from "../controllers/TrusteeController";
import { TrusteeDto } from "./dto/TrusteeDto";

export class TrusteeRouter {
  private _router = Router();
  private _controller = new TrusteeController();

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  private _configure() {
    this._router.post(
      "/login",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          this._controller.loginTrustee(req.body as TrusteeDto).then((obj) => {
            res.status(200).json(obj);
          });
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from "typeorm";
import { Survey } from '../entities/Survey';

export class AdminRouter {
    private _router = Router();

    get router() {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    private _configure() {
        this._router.get('/survey/list', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await getRepository(Survey).find();
                console.log(result);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}

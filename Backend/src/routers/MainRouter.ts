import { Router } from 'express';
import SubRouter from './SubRouter';

class MainRouter {
    private _router = Router();
    private _subrouter = SubRouter;


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
        this._router.use('/themeA', this._subrouter);
    }
}

export = new MainRouter().router;
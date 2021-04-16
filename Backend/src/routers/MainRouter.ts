import { Router } from 'express';
import SubRouter from './SubRouter';
import AdminRouter from './AdminRouter';
class MainRouter {
    private _router = Router();
    private _subrouter = SubRouter;
    private _adminrouter = AdminRouter;

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
        this._router.use('/admin', this._adminrouter);
    }
}

export = new MainRouter().router;
import {Router} from 'express';
import {SubRouter} from './SubRouter';
import {AdminRouter} from './AdminRouter';

export class MainRouter {
    private _router = Router();
    private _subrouter = new SubRouter().router;
    private _adminrouter = new AdminRouter().router;

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

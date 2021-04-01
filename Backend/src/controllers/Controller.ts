import ErrorHandler from "../models/ErrorHandler";


class Controller {
    defaultMethod() {
        throw new ErrorHandler(501, 'Not implemented method');
    }
}

export = new Controller();
import ErrorHandler from "../models/ErrorHandler";

export class Controller {
    defaultMethod() {
        throw new ErrorHandler(501, 'Not implemented method');
    }
}

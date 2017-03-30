import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import Middleware = require('../modules/middleware');

export class ApiRoutes extends BaseRoute {
    public static create(router: Router) {
        //log
        console.log("[ApiRoutes::create] Creating api routes.");


        router.get('/api/me', (req: Request, res: Response) => {
            res.send({ user: req.user });
        })



    }
    constructor() {
        super();
    }

}




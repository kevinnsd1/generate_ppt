import { Response } from 'express';

class BadRequestResponse {
    badRequest(req: any, res: Response, data: any) {
        data.message = 'BAD_REQUEST';
        data.status = 'BAD_REQUEST';
        data.statusCode = '400 OK';
        res.status(400).json(data);
    }
}

export = BadRequestResponse;

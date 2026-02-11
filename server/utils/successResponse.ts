import { Request, Response } from 'express';

interface ResponseData {
    message?: string;
    status?: string;
    statusCode?: string;
    [key: string]: any;
}

class SuccessResponse {
    resultSuccessful(req: Request, res: Response, data: ResponseData): void {
        data.message = 'REQUEST_SUCCESSFUL';
        data.status = 'OK';
        data.statusCode = '200 OK';
        res.status(200).json(data);
    }

    resultCreated(req: Request, res: Response, data: ResponseData): void {
        data.message = 'DATA_CREATED';
        data.status = 'CREATED';
        data.statusCode = '201 CREATED';
        res.status(200).json(data);
    }

    resultUpdated(req: Request, res: Response, data: ResponseData): void {
        data.message = 'DATA_UPDATE';
        data.status = 'OK';
        data.statusCode = '200 OK';
        res.status(200).json(data);
    }

    resultDelete(req: Request, res: Response, data: ResponseData): void {
        data.message = 'DATA_DELETED';
        data.status = 'OK';
        data.statusCode = '200 OK';
        res.status(200).json(data);
    }
}

export default SuccessResponse;

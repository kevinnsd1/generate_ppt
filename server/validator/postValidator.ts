import { check, validationResult, ValidationError, Result } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
const BadRequestResponse = require('../utils/badRequestResponse');
const badRequestResponse = new BadRequestResponse();

export const validatePost = [
    check('titles').not().isEmpty().withMessage('titles.name not empty').bail(),
    check('titles.*.title').isLength({ min: 3 }).withMessage('title min lenght 3').bail(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors: Result<ValidationError> = validationResult(req);
        let tmpError: any[] = [];
        if (!errors.isEmpty()) {
            const errorList = errors.array();
            for (let i = 0; i < errorList.length; i++) {
                const message = errorList[i].msg;
                const objectError = {
                    error: message,
                };
                tmpError.push(objectError);
            }
            let advancedResults = {
                errors: tmpError,
            };
            return badRequestResponse.badRequest(req, res, advancedResults);
        } else {
            next();
        }
    },
];

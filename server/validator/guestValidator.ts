import { check, validationResult, ValidationError, Result } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
const BadRequestResponse = require('../utils/badRequestResponse');
const badRequestResponse = new BadRequestResponse();

export const validateGuest = [
    check('email')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Email min lenght 3')
        .isEmail()
        .withMessage('Email Not Valid')
        .not()
        .isEmpty()
        .withMessage('Invalid email address!')
        .bail(),
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

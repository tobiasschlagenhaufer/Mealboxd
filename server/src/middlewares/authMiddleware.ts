import { Request, Response, NextFunction } from 'express';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader == 'Valid Bearer') {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}
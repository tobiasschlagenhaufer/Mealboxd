import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import prisma from '../prismaClient';
import { forceUserFields } from '../models/userModel';

interface UserRequest extends Request {
    user?: User
}

export const authenticateToken = async (req: UserRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // Did we get a token
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify the token
    let decoded: string | JwtPayload
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as { userId: string }
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token.' });
    }

    // Get the user
    let user: User | null
    try {
        user = await prisma.user.findUnique({
            ...forceUserFields,
            where: { id: decoded.userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Attach the user object to the req object for use in route handlers
        req.user = user;

        next();
    } catch (error) {
        console.error('Error while fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
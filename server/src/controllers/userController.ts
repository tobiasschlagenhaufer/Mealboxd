import { Request, Response } from 'express';

export const getAllUsers = (req: Request, res: Response) => {
    res.send('Getting all users');
}

export const getUserById = (req: Request, res: Response) => {
    const userId = req.params.id;
    res.send(`Getting user with id ${userId}`);
}
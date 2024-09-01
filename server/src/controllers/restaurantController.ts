import { Request, Response } from 'express';

export const getAllRestaurants = (req: Request, res: Response) => {
    res.send('Getting all restuarants');
}

export const getRestaurantById = (req: Request, res: Response) => {
    const restId = req.params.id;
    res.send(`Getting restaurant with id ${restId}`);
}
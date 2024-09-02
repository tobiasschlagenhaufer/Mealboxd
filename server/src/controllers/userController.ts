import { Request, Response } from 'express';
import { User, RestaurantRating, forceUserFields } from '../models/userModel';
import prisma from '../prismaClient';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';

interface UserRequest extends Request {
    user?: User
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users: User[] = await prisma.user.findMany(forceUserFields);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const foundUser: User | null = await prisma.user.findUnique({
            ...forceUserFields,
            where: { id: userId },
        });

        if (!foundUser) {
            return res.status(401).json({ message: 'Invalid user id' });
        }

        res.send(`Getting user with id ${userId}, its ${JSON.stringify(foundUser)}`);
    } catch (error) {
        console.error('Error while fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

const generateJwtToken = (user: User) => {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET as Secret, { expiresIn: '1h' });
};

export const signup = async (req: Request, res: Response) => {
    const {
        username,
        email,
        phone,
        password
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    // Check if username exists
    try {
        const foundUser: User | null = await prisma.user.findUnique({
            ...forceUserFields,
            where: { username: username },
        });

        if (foundUser) {
            return res.status(400).json({ message: 'Username is taken' });
        }
    } catch (error) {
        console.error('Error while fetching username:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Create new user
    try {
        const newUser: User = await prisma.user.create({
            ...forceUserFields,
            data: {
                username,
                email,
                phone,
                password: hashedPassword,
            },
        });
        const token = generateJwtToken(newUser);

        res.status(201).json({ user: newUser, token: token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req: UserRequest, res: Response) => {
    const { username, password } = req.body;
    const user: User = req.user as User;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const isCorrentPassword = await bcrypt.compare(password, user.password)

    if (!isCorrentPassword) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateJwtToken(user);

    res.json({ user: user, token: token });
}

export const getAllRestaurantRatings = async (req: Request, res: Response) => {
    try {
        const restaurantRatings: RestaurantRating[] = await prisma.restaurantRating.findMany();
        res.json(restaurantRatings);
    } catch (error) {
        console.error('Error while fetching res ratings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const rateRestaurant = async (req: UserRequest, res: Response) => {
    const { placeId, rating, comment } = req.body;
    const user = req.user; // We can trust this exists as its from the auth middleware

    if (!placeId || !rating || !user) {
        return res.status(400).json({ message: 'placeid, rating, and user are required' });
    }

    if (rating > 10 || rating < 1) {
        return res.status(400).json({ message: 'Rating must be between 1 and 10' });
    }

    try {
        const newRating: RestaurantRating = await prisma.restaurantRating.create({
            data: {
                userId: user.id,
                placeId,
                rating: Number(rating),
                comment: comment || ''
            }
        });

        res.status(201).json({ message: 'Rating added successfully.', rating: newRating });
    } catch (error) {
        console.error('Error adding rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
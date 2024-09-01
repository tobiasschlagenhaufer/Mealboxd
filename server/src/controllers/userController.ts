import { Request, Response } from 'express';
import { User, users } from '../models/userModel';
import { v4 as uuidv4 } from 'uuid';

export const getAllUsers = (req: Request, res: Response) => {
    res.send(`Getting all users: ${JSON.stringify(Array.from(users.values()))}`);
}

export const getUserById = (req: Request, res: Response) => {
    const userId = req.params.id;

    const foundUser = users.get(userId);

    if (!foundUser) {
        return res.status(401).json({ message: 'Invalid user id' });
    }

    res.send(`Getting user with id ${userId}, its ${JSON.stringify(foundUser)}`);
}

export const signup = (req: Request, res: Response) => {
    const {
        username,
        email,
        phone,
        password
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if username exists
    for (let user of users.values()) {
        if (user.username == username) {
            return res.status(400).json({ message: 'Username already taken' });
        }
    }

    // Create new user
    const newUser: User = {
        id: uuidv4(),
        username,
        email,
        password,
        phone,
        googleId: "",
        restaurantRatings: [],
        favouritedRestaurants: [],
    }

    users.set(newUser.id, newUser);

    res.status(201).json({ message: `User ${newUser.id} created successfully ${JSON.stringify(newUser)}` })
}

export const login = (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    let foundUser: User | undefined;
    for (let user of users.values()) {
        if (user.username == username && user.password == password) {
            foundUser = user;
            break;
        }
    }

    if (!foundUser) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: `Login successful for ${foundUser.id}` });
}
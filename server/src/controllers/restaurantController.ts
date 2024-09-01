import { Request, Response } from 'express';
import { Restaurant, restaurants } from '../models/restaurantModel';
import axios from 'axios';
import prisma from '../prismaClient';

export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        const restaurants = await prisma.restaurant.findMany();
        res.json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const autocompleteRestaurants = async (req: Request, res: Response) => {
    const { input, latitude, longitude } = req.query;

    if (!input || !latitude || !longitude) {
        return res.status(400).json({ message: 'Input and location are required' });
    }

    try {
        const autocompleteUrl = `https://places.googleapis.com/v1/places:autocomplete`;
        const encodedInput = encodeURI(input as string);
        const requestData = {
            input: encodedInput,
            locationBias: {
                circle: {
                    center: {
                        latitude,
                        longitude,
                    },
                },
            }
        }

        const headers = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
        }

        const response = await axios.post(autocompleteUrl, requestData, { headers });
        const suggestions = response.data.suggestions;

        const results = suggestions.map((prediction: any) => ({
            placeId: prediction.placePrediction.placeId,
            name: prediction.placePrediction.structuredFormat.mainText.text,
            address: prediction.placePrediction.structuredFormat.secondaryText.text,
        }));

        res.status(200).json(results);
    } catch (error: any) {
        console.error(`Error fetching autocomplete results`, error);
        console.log(JSON.stringify(error.response.data));
        res.status(500).json({ message: 'Error fetching autocomplete from google' });
    }
}

export const getRestaurantDetails = async (req: Request, res: Response) => {
    const placeId = req.params.placeId;
    let restaurant: Restaurant | undefined;

    // Do we have it stored?
    try {
        let restaurant = await prisma.restaurant.findUnique({
            where: { placeId }
        });

        if (restaurant) {
            console.log('Fetched from cache');
            return res.status(200).json(restaurant);
        }
    } catch (error) {
        console.error('Error fetching restaurant from DB', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    // Ask Google
    try {
        const placeUrl = `https://places.googleapis.com/v1/places/${placeId}`
        const headers = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
            'X-Goog-FieldMask': 'id,displayName,formattedAddress'
        }

        const response = await axios.get(placeUrl, { headers });
        const data = response.data;

        try {
            const newRestaurant = await prisma.restaurant.create({
                data: {
                    placeId: data.id,
                    name: data.displayName.text,
                    address: data.formattedAddress,
                    sumRatings: 0,
                    numRatings: 0,
                }
            });

            console.log('Fetched from Google');
            res.status(200).json(newRestaurant);
        } catch (error) {
            console.error('Error adding restaurant:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } catch (error: any) {
        console.error(`Error fetching autocomplete results`, error);
        console.log(JSON.stringify(error.response.data));
        res.status(500).json({ message: 'Error fetching autocomplete from google' });
    }
}
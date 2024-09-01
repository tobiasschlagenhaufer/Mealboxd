import { Restaurant } from "@prisma/client";

export interface RestaurantRating {
    id: string,
    placeId: string,
    userId: string,
    rating: number,
    comment: string,
    timestamp: Date,
}

export interface User {
    id: string,
    username: string,
    email?: string | null,
    phone?: string | null,
    password: string,
    googleId?: string | null,
    ratings: RestaurantRating[],
    favourites: Restaurant[];
}

export const forceUserFields = {
    include: {
        ratings: true,
        favourites: true,
    }
}
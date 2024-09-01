export interface RestaurantRating {
    id: string,
    restaurantId: string,
    placeId: string,
    userId: string,
    rating: number,
    comment: string,
    timestamp: Date,
}

export interface User {
    id: string,
    username: string,
    email?: string,
    phone?: string,
    password: string,
    googleId: string,
    restaurantRatings: RestaurantRating[],
    favouritedRestaurants: string[];
}

export const users: Map<string, User> = new Map();
export const restaurantRatings: Map<string, RestaurantRating[]> = new Map();
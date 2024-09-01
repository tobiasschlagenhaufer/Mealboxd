export interface RestaurantRating {
    restaurantId: string,
    rating: number,
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
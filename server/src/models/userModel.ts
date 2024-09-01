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
    email?: string,
    phone?: string,
    password: string,
    googleId?: string,
    ratings: RestaurantRating[],
    favourites: string[];
}
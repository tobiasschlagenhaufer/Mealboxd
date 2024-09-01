export interface Restaurant {
    placeId: string,
    name: string,
    phone?: string,
    rating?: number,
    website?: string,
    address: string
}

export const restaurants: Map<string, Restaurant> = new Map();
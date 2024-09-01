export interface Restaurant {
    id: string,
    name: string,
    placeId?: string,
    phone?: string,
    rating?: number,
    website?: string,
    address: string
}

export const restaurants: Map<string, Restaurant> = new Map();
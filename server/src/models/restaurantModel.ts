export interface Restaurant {
    placeId: string,
    name: string,
    phone?: string | null,
    rating?: number | null,
    website?: string | null,
    address: string
}

export const restaurants: Map<string, Restaurant> = new Map();
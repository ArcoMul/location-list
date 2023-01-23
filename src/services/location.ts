import jsonLocations from "../data/customerLocations.json";

export const locations = jsonLocations;

export function matchLocationsByName(query: string) {
    const lquery = query.toLowerCase();
    return jsonLocations.filter((l) => l.name.toLowerCase().includes(lquery))
}
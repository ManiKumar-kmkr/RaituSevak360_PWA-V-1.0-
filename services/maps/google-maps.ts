/**
 * Google Maps API Service Integration.
 * Manages geocoding, reverse geocoding, and farm boundary distance calculations.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export class GoogleMapsService {
  async reverseGeocode(coords: Coordinates): Promise<{ formattedAddress: string; district: string; state: string }> {
    // Placeholder clean contract for Google Maps Geocoding API
    return {
      formattedAddress: `Lat: ${coords.lat}, Lng: ${coords.lng}`,
      district: 'Karimnagar',
      state: 'Telangana',
    };
  }

  calculateDistanceKm(origin: Coordinates, destination: Coordinates): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(destination.lat - origin.lat);
    const dLon = toRad(destination.lng - origin.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(origin.lat)) * Math.cos(toRad(destination.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }
}

export const googleMapsService = new GoogleMapsService();

/**
 * Third-party service configuration (Firebase, Google Maps, Cloud Storage, Payment).
 * Keeps credentials decoupled and accessed via environmental variables.
 */
export const servicesConfig = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
  },
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  },
  cloudStorage: {
    key: process.env.CLOUD_STORAGE_KEY || '',
    bucket: process.env.CLOUD_STORAGE_BUCKET || '',
    region: process.env.CLOUD_STORAGE_REGION || 'ap-south-1',
  },
  paymentGateway: {
    keyId: process.env.PAYMENT_GATEWAY_KEY || '',
    secret: process.env.PAYMENT_GATEWAY_SECRET || '',
  },
  aiEngine: {
    baseUrl: process.env.AI_API_URL || 'http://localhost:8000/api/v1',
  },
};

// The Jawāb API runs on the DigitalOcean droplet behind Caddy (HTTPS).
// Override per build with EXPO_PUBLIC_API_URL (see .env.example).
export const DEFAULT_API_URL = 'https://167-172-189-107.sslip.io';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');

export const REQUEST_TIMEOUT_MS = 15000;

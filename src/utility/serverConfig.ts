// Central place to keep the Socket / server link used by the app
// Edit this single constant to change the server used by both the client
// socket helper and the WebSocket provider.

// NOTE: This file intentionally keeps a single link (server URL) for the app.
// If you need environment-specific overrides later, replace this with an env-based
// loader or use app.json / runtime config.

// Use the server base URL (without the /socket.io path) — the client sets path separately.
// Primary server to try first. Edit this to change the first attempt.
export const SOCKET_SERVER_URL = 'https://webs01.dostenterprises.com';

// List of fallback server endpoints to try when the primary is unreachable.
// Order matters — the client will try each in order until it connects.
export const SOCKET_SERVER_URLS = [
    SOCKET_SERVER_URL, // primary
    'https://car01.dostenterprises.com:8090',
    // Helpful local/emulator defaults for development
    'http://192.168.1.35:3000',
    'http://localhost:3000',
];

// Default developer preference. Set to true to prefer polling transport (less likely to fail on some networks)
export const DEFAULT_FORCE_POLLING = false;

export default SOCKET_SERVER_URL;
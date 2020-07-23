const env = Deno.env.toObject();
export const APP_HOST = env.APP_HOST || "127.0.0.1";
export const APP_PORT = parseInt(env.APP_PORT) || 8000;

export const DB_HOST = env.DB_HOST || "localhost";
export const DB_USER = env.DB_USER || "postgres";
export const DB_PASSWORD = env.DB_PASSWORD || "0";
export const DB_DATABASE = env.DB_DATABASE || "postgres";
export const DB_PORT = env.DB_PORT ? parseInt(env.DB_PORT) : 5432;

export const API_VERSION = env.API_VERSION || "/api/v1";

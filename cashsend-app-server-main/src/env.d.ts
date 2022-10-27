declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string
    REDIS_URL: string
    PORT: string
    SESSION_SECRET: string
    JWT_SECRET: string
    FB_APP_IDD: string
    FB_CLIENT_SECRET: string
    FB_REDIRECT_URL: string
    STRIPE_SECRET_TEST: string
    STRIPE_PUBLIC_TEST: string
    STRIPE_SECRET_KEY_TEST: string
    STRIPE_PUBLIC_KEY_TEST: string
    STRIPE_WEBHOOK_SECRET: string
    CORS_WEB_ENDPOINT: string
    CORS_PARTNER_MANAGER: string
    CORS_CHECKOUT_DEMO: string
    SEND_GRID_API_KEY: string
  }
}

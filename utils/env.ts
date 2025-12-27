
import { Environment } from "@/types/env";


export const ENVIRONMENT_VARIABLES: Environment[] = [
    {
        environment_type: 'production',
        api_url: process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL
    },
    {
        environment_type: 'staging',
        api_url: process.env.NEXT_PUBLIC_STAGING_BACKEND_URL
    },
    {
        environment_type: 'development',
        api_url: process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
    }
]
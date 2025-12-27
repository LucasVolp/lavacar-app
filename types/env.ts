export type EnvironmentType = 'production' | 'staging' | 'development'

export type Environment = {
    environment_type: EnvironmentType;
    api_url?: string;
}

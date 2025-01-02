// This file is auto-generated by @hey-api/openapi-ts

import { createClient, createConfig, type OptionsLegacyParser } from '@hey-api/client-fetch';
import type { HandleDeployCloudstateData, HandleDeployCloudstateError, HandleDeployCloudstateResponse, HandleBackupCloudstateError, HandleBackupCloudstateResponse, HandleExecuteScriptData, HandleExecuteScriptError, HandleExecuteScriptResponse, HandleDeployWebData, HandleDeployWebError, HandleDeployWebResponse, HandleGetLogsError, HandleGetLogsResponse } from './types.gen';

export const client = createClient(createConfig());

/**
 * Deploy Cloudstate Project
 * Deploy a cloudstate project
 */
export const handleDeployCloudstate = <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<HandleDeployCloudstateData, ThrowOnError>) => {
    return (options?.client ?? client).post<HandleDeployCloudstateResponse, HandleDeployCloudstateError, ThrowOnError>({
        ...options,
        url: '/cloudstate/v1/deploy'
    });
};

/**
 * Get Backup of Cloudstate Project
 * Get a backup of a cloudstate project
 */
export const handleBackupCloudstate = <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<HandleBackupCloudstateResponse, HandleBackupCloudstateError, ThrowOnError>({
        ...options,
        url: '/cloudstate/v1/projects/:id/backup'
    });
};

/**
 * Execute Code
 * Send a TypeScript or JavaScript module, get the result
 */
export const handleExecuteScript = <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<HandleExecuteScriptData, ThrowOnError>) => {
    return (options?.client ?? client).post<HandleExecuteScriptResponse, HandleExecuteScriptError, ThrowOnError>({
        ...options,
        url: '/execute/v1/script'
    });
};

/**
 * Deploy a Website
 * Deploy a website. Files is a map of file paths to file contents. Configuration is optional and contains additional information about the deployment.
 */
export const handleDeployWeb = <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<HandleDeployWebData, ThrowOnError>) => {
    return (options?.client ?? client).post<HandleDeployWebResponse, HandleDeployWebError, ThrowOnError>({
        ...options,
        url: '/web/v1/deploy'
    });
};

/**
 * Get Website Logs
 * Get the logs for a project
 */
export const handleGetLogs = <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<HandleGetLogsResponse, HandleGetLogsError, ThrowOnError>({
        ...options,
        url: '/web/v1/projects/:id/logs'
    });
};
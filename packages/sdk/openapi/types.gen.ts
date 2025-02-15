// This file is auto-generated by @hey-api/openapi-ts

export type Behavior = 'regex' | 'exact';

export type CreateRepositoryRequest = {
    name: string;
};

export type DeploymentLogEntry = {
    deploymentId: string;
    accountId: string;
    provisionedAt: string;
    timeout: string;
    state: DeploymentState;
    deployedAt?: (string) | null;
    domains: Array<(string)>;
    envVars: {
        [key: string]: (string);
    };
};

export type DeploymentState = 'provisioning' | 'deployed' | 'failed';

export type ExecuteLogEntry = {
    deployment: string;
    accountId: string;
    provisionedAt: string;
    startedAt?: (string) | null;
    duration?: (string) | null;
    state: ExecuteRunState;
    envVars: {
        [key: string]: (string);
    };
};

export type ExecuteRunInfo = {
    code: string;
    nodeModules: {
        [key: string]: (string);
    };
};

export type ExecuteRunState = 'starting' | 'running' | 'complete';

export type FreestyleCloudstateDeployConfiguration = {
    /**
     * ID of the project to deploy, if not provided will create a new project
     */
    domains?: Array<(string)> | null;
    /**
     * The environment variables that the cloudstate deploy can access
     */
    envVars?: {
        [key: string]: (string);
    };
    cloudstateDatabaseId?: (string) | null;
};

export type FreestyleCloudstateDeployErrorResponse = {
    message: string;
};

export type FreestyleCloudstateDeployRequest = {
    classes: string;
    config?: FreestyleCloudstateDeployConfiguration;
};

export type FreestyleCloudstateDeploySuccessResponse = {
    deploymentId: string;
    cloudstateDatabaseId: string;
};

export type FreestyleDeleteDomainVerificationRequest = {
    /**
     * The domain to create a verification code for
     */
    domain: string;
    /**
     * The verification code
     */
    verificationCode: string;
};

export type FreestyleDeployWebConfiguration = {
    /**
     * The entrypoint file for the website
     */
    entrypoint?: (string) | null;
    /**
     * The custom domains for the website, eg. [\"subdomain.yourwebsite.com\"]. You may include a single *.style.dev domain here.
     */
    domains?: Array<(string)> | null;
    /**
     * Project ID was our original way of tracking deployments together, it is now deprecated and will be removed in the future. Please use the domains field to specify the domains for your project.
     * @deprecated
     */
    projectId?: (string) | null;
    /**
     * Node Modules to install for the website, a map of package names to versions, e.g. { \"express\": \"4.17.1\" }. If this and a package-lock.json are provided, the package-lock.json, bun.lockb, pnpm-lock.yaml, or yarn.lock is also provided, the versions here will override the versions in those lock files.
     */
    nodeModules?: {
        [key: string]: (string);
    } | null;
    /**
     * The environment variables that the website can access
     * e.g. { \"RESEND_API_KEY\": \"re_123456789\" }
     */
    envVars?: {
        [key: string]: (string);
    } | null;
    serverStartCheck?: boolean;
    networkPermissions?: Array<FreestyleNetworkPermission> | null;
};

export type FreestyleDeployWebErrorResponse = {
    message: string;
};

export type FreestyleDeployWebPayload = {
    /**
     * The files to deploy, a map of file paths to file contents, e.g. { \"index.js\": {\"content\": \"your main\", \"encoding\": \"utf-8\"}, \"file2.js\": {\"content\": \"your helper\" } }
     *
     * **Do not include node modules in this bundle, they will not work**. Instead, includes a package-lock.json, bun.lockb, pnpm-lock.yaml, or yarn.lock, the node modules for the project will be installed from that lock file, or use the node_modules field in the configuration to specify the node modules to install.
     */
    files: {
        [key: string]: FreestyleFile;
    };
    config?: FreestyleDeployWebConfiguration;
};

export type FreestyleDeployWebSuccessResponse = {
    deploymentId: string;
    domains?: Array<(string)> | null;
    /**
     * @deprecated
     */
    projectId?: (string) | null;
};

export type FreestyleDomainVerificationRequest = {
    /**
     * The domain to create a verification code for
     */
    domain: string;
};

export type FreestyleExecuteScriptParams = {
    /**
     * The JavaScript or TypeScript script to execute
     */
    script: string;
    config?: FreestyleExecuteScriptParamsConfiguration;
};

export type FreestyleExecuteScriptParamsConfiguration = {
    /**
     * The environment variables to set for the script
     */
    envVars?: {
        [key: string]: (string);
    };
    /**
     * The node modules to install for the script
     */
    nodeModules?: {
        [key: string]: (string);
    };
    /**
     * Tags for you to organize your scripts, useful for tracking what you're running
     */
    tags?: Array<(string)>;
    /**
     * The script timeout
     */
    timeout?: (string) | null;
    /**
     * If false, we'll not resolve peer dependencies for the packages given, this can speed up execute performance, but will break packages with peers unless the peers are manually specified.
     */
    peerDependencyResolution?: boolean;
    networkPermissions?: Array<FreestyleNetworkPermission> | null;
};

export type FreestyleExecuteScriptResultSuccess = {
    result: unknown;
    logs: Array<FreestyleJavaScriptLog>;
};

export type FreestyleFile = {
    /**
     * The content of the file
     */
    content: string;
    /**
     * The encoding of the file. Either **utf-8** or **base64**
     */
    encoding?: string;
};

export type FreestyleGetLogsResponse = {
    logs: Array<FreestyleLogResponseObject>;
};

export type FreestyleJavaScriptLog = {
    /**
     * The log message
     */
    message: string;
    /**
     * The log level
     */
    type: string;
};

export type FreestyleLogResponseObject = {
    message: string;
    timestamp: string;
};

export type FreestyleNetworkPermission = (NetworkPermissionData & {
    action: 'allow';
}) | (NetworkPermissionData & {
    action: 'deny';
});

export type action = 'allow';

export type FreestyleVerifyDomainRequest = {
    domain: string;
};

export type NetworkPermissionData = {
    query: string;
    behavior?: Behavior;
};

export type RepositoryInfo = {
    id: string;
    name: string;
    ownerId: string;
};

export type HandleDeployCloudstateData = {
    body: FreestyleCloudstateDeployRequest;
};

export type HandleDeployCloudstateResponse = (FreestyleCloudstateDeploySuccessResponse);

export type HandleDeployCloudstateError = (FreestyleCloudstateDeployErrorResponse);

export type HandleBackupCloudstateData = {
    path: {
        id: string;
    };
};

export type HandleBackupCloudstateResponse = (Array<(number)>);

export type HandleBackupCloudstateError = (unknown);

export type HandleVerifyWildcardResponse = ({
    domain: string;
});

export type HandleVerifyWildcardError = ({
    message: string;
});

export type HandleListDomainsResponse = (Array<{
    domain: string;
    createdAt: number;
}>);

export type HandleListDomainsError = ({
    message: string;
});

export type HandleListDomainVerificationRequestsResponse = (Array<{
    verificationCode: string;
    domain: string;
    createdAt: number;
}>);

export type HandleListDomainVerificationRequestsError = ({
    message: string;
});

export type HandleVerifyDomainData = {
    body: FreestyleVerifyDomainRequest;
};

export type HandleVerifyDomainResponse = ({
    domain: string;
});

export type HandleVerifyDomainError = ({
    message: string;
});

export type HandleCreateDomainVerificationData = {
    body: FreestyleDomainVerificationRequest;
};

export type HandleCreateDomainVerificationResponse = ({
    verificationCode: string;
    domain: string;
});

export type HandleCreateDomainVerificationError = ({
    message: string;
});

export type HandleDeleteDomainVerificationData = {
    body: FreestyleDeleteDomainVerificationRequest;
};

export type HandleDeleteDomainVerificationResponse = ({
    verificationCode: string;
    domain: string;
});

export type HandleDeleteDomainVerificationError = ({
    message: string;
});

export type HandleListExecuteRunsData = {
    query?: {
        limit?: (number) | null;
        offset?: (number) | null;
    };
};

export type HandleListExecuteRunsResponse = ({
    entries: Array<ExecuteLogEntry>;
    total: number;
    offset: number;
});

export type HandleListExecuteRunsError = ({
    message: string;
});

export type HandleGetExecuteRunData = {
    path: {
        deployment: string;
    };
};

export type HandleGetExecuteRunResponse = ({
    metadata: ExecuteLogEntry;
    code: ExecuteRunInfo;
});

export type HandleGetExecuteRunError = ({
    message: string;
});

export type HandleExecuteScriptData = {
    body: FreestyleExecuteScriptParams;
};

export type HandleExecuteScriptResponse = ({
    result: unknown;
    logs: Array<FreestyleJavaScriptLog>;
});

export type HandleExecuteScriptError = ({
    error: string;
});

export type ListRepositoriesHandlerData = {
    query: {
        /**
         * Maximum number of repositories to return
         */
        limit: number;
        /**
         * Offset for the list of repositories
         */
        offset: number;
    };
};

export type ListRepositoriesHandlerResponse = ({
    repositories: Array<RepositoryInfo>;
    offset: number;
});

export type ListRepositoriesHandlerError = (string);

export type CreateRepoHandlerData = {
    body: CreateRepositoryRequest;
};

export type CreateRepoHandlerResponse = ({
    repo_id: string;
});

export type CreateRepoHandlerError = (string | unknown);

export type DeleteRepoHandlerData = {
    path: {
        /**
         * The repository id
         */
        repo: string;
    };
};

export type DeleteRepoHandlerResponse = (unknown);

export type DeleteRepoHandlerError = (string | unknown);

export type HandleGetLogsData = {
    query?: {
        deploymentId?: (string) | null;
        domain?: (string) | null;
    };
};

export type HandleGetLogsResponse = (FreestyleGetLogsResponse);

export type HandleGetLogsError = unknown;

export type HandleDeployWebData = {
    body: FreestyleDeployWebPayload;
};

export type HandleDeployWebResponse = (FreestyleDeployWebSuccessResponse);

export type HandleDeployWebError = (FreestyleDeployWebErrorResponse);

export type HandleListWebDeploysData = {
    query: {
        /**
         * Maximum number of repositories to return
         */
        limit: number;
        /**
         * Offset for the list of repositories
         */
        offset: number;
    };
};

export type HandleListWebDeploysResponse = ({
    entries: Array<DeploymentLogEntry>;
    total: number;
    offset: number;
});

export type HandleListWebDeploysError = ({
    message: string;
});

export type HandleGetWebDeployDetailsData = {
    path: {
        deployment_id: string;
    };
};
// This file is auto-generated by @hey-api/openapi-ts

/**
 * Identical to [`RepositoryInfo`], but with the permissions field added.
 */
export type AccessibleRepository = {
    id: string;
    name?: (string) | null;
    accountId: string;
    permissions: AccessLevel;
    visibility: Visibility;
};

export type AccessLevel = 'read' | 'write';

export type AccessTokenInfo = {
    id: string;
};

export type Behavior = 'regex' | 'exact';

export type BuildOptions = {
    command?: (string) | null;
};

export type CreateDomainMappingRequest = {
    deploymentId: string;
};

export type CreatedToken = {
    id: string;
    token: string;
};

export type CreateRepositoryRequest = {
    /**
     * This name is not visible to users, and is only accessible to you via API and in the
     * dashboard. Mostly useful for observability.
     */
    name?: (string) | null;
    public?: boolean;
};

export type CreateRepositoryResponseSuccess = {
    repoId: string;
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

export type DeploymentSource = {
    files: {
        [key: string]: FreestyleFile;
    };
    kind: 'files';
} | {
    url: string;
    kind: 'tar';
};

export type kind = 'files';

export type DeploymentState = 'provisioning' | 'deployed' | 'failed';

export type DescribePermissionResponseSuccess = {
    identity: string;
    repo: string;
    accessLevel?: (null | AccessLevel);
};

export type DnsRecord = {
    kind: DnsRecordKind;
    name: string;
    value: string;
    ttl: string;
    priority?: (number) | null;
    managed: boolean;
};

export type DnsRecordKind = 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'NS';

export type DomainVerificationRequest = {
    id: string;
    domain: string;
    accountId: string;
    verificationCode: string;
    createdAt: number;
};

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
    build?: (null | BuildOptions);
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

export type FreestyleDeployWebPayloadV2 = {
    /**
     * The files to deploy, a map of file paths to file contents, e.g. { \"index.js\": {\"content\": \"your main\", \"encoding\": \"utf-8\"}, \"file2.js\": {\"content\": \"your helper\" } }
     *
     * **Do not include node modules in this bundle, they will not work**. Instead, includes a package-lock.json, bun.lockb, pnpm-lock.yaml, or yarn.lock, the node modules for the project will be installed from that lock file, or use the node_modules field in the configuration to specify the node modules to install.
     */
    source: DeploymentSource;
    config?: FreestyleDeployWebConfiguration;
};

export type FreestyleDeployWebSuccessResponseV2 = {
    deploymentId: string;
    /**
     * @deprecated
     */
    projectId: string;
    domains?: Array<(string)> | null;
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
    /**
     * These headers will be added to every fetch request made through the script
     */
    customHeaders?: {
        [key: string]: (string);
    };
    /**
     * Proxy all outgoing requests through this URL
     */
    proxy?: (string) | null;
};

export type FreestyleExecuteScriptResultSuccess = {
    /**
     * The return value of the default export of the script
     */
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

/**
 * Verify a domain verification request, can either be done for a domain, or for a specific request
 */
export type FreestyleVerifyDomainRequest = {
    domain: string;
} | {
    id: string;
};

export type GitIdentity = {
    id: string;
};

export type GitRepositoryTrigger = {
    repositoryId: string;
    trigger: ({
    branches?: Array<(string)> | null;
    globs?: Array<(string)> | null;
    event: 'push';
});
    action: ({
    endpoint: string;
    action: 'webhook';
});
    managed: boolean;
    id: string;
    createdAt: number;
};

export type event = 'push';

export type action2 = 'webhook';

export type GitTrigger = {
    branches?: Array<(string)> | null;
    globs?: Array<(string)> | null;
    event: 'push';
};

export type GitTriggerAction = {
    endpoint: string;
    action: 'webhook';
};

export type GrantPermissionRequest = {
    permission: AccessLevel;
};

export type ListGitTokensResponseSuccess = {
    tokens: Array<AccessTokenInfo>;
};

export type ListPermissionResponseSuccess = {
    repositories: Array<AccessibleRepository>;
};

export type ListRecordsResponse = {
    records: Array<DnsRecord>;
};

export type NetworkPermissionData = {
    query: string;
    behavior?: Behavior;
};

export type RepositoryInfo = {
    id: string;
    name?: (string) | null;
    accountId: string;
    visibility: Visibility;
};

export type RevokeGitTokenRequest = {
    tokenId: string;
};

export type UpdatePermissionRequest = {
    permission: AccessLevel;
};

export type Visibility = 'public' | 'private';

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

export type HandleListRecordsData = {
    query: {
        domain: string;
    };
};

export type HandleListRecordsResponse = (ListRecordsResponse);

export type HandleListRecordsError = ({
    message: string;
});

export type HandleCreateRecordData = {
    query: {
        domain: string;
        record: DnsRecord;
    };
};

export type HandleCreateRecordResponse = ({
    record: DnsRecord;
});

export type HandleCreateRecordError = ({
    message: string;
});

export type HandleDeleteRecordData = {
    query: {
        domain: string;
        record: DnsRecord;
    };
};

export type HandleDeleteRecordResponse = ({
    message: string;
});

export type HandleDeleteRecordError = ({
    message: string;
});

export type HandleVerifyWildcardData = {
    path: {
        domain: string;
    };
};

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

export type HandleInsertDomainMappingData = {
    body: CreateDomainMappingRequest;
    path: {
        domain: string;
    };
};

export type HandleInsertDomainMappingResponse = (unknown);

export type HandleInsertDomainMappingError = ({
    message: string;
});

export type HandleDeleteDomainMappingData = {
    path: {
        domain: string;
    };
};

export type HandleDeleteDomainMappingResponse = (unknown);

export type HandleDeleteDomainMappingError = ({
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

export type HandleCreateDomainVerificationResponse = (DomainVerificationRequest);

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
    /**
     * The return value of the default export of the script
     */
    result: unknown;
    logs: Array<FreestyleJavaScriptLog>;
});

export type HandleExecuteScriptError = ({
    error: string;
    logs?: Array<FreestyleJavaScriptLog> | null;
});

export type HandleCreateIdentityResponse = (GitIdentity);

export type HandleCreateIdentityError = ({
    message: string;
});

export type HandleDeleteIdentityData = {
    path: {
        identity: string;
    };
};

export type HandleDeleteIdentityResponse = ({
    [key: string]: unknown;
});

export type HandleDeleteIdentityError = ({
    message: string;
});

export type HandleListPermissionsData = {
    path: {
        identity: string;
    };
    query?: {
        /**
         * Maximum number of repositories to return
         */
        limit?: number;
        /**
         * Offset for the list of repositories
         */
        offset?: number;
    };
};

export type HandleListPermissionsResponse = (ListPermissionResponseSuccess);

export type HandleListPermissionsError = ({
    message: string;
});

export type HandleDescribePermissionData = {
    path: {
        identity: string;
        repo: string;
    };
};

export type HandleDescribePermissionResponse = (DescribePermissionResponseSuccess);

export type HandleDescribePermissionError = ({
    message: string;
});

export type HandleGrantPermissionData = {
    body: GrantPermissionRequest;
    path: {
        identity: string;
        repo: string;
    };
};

export type HandleGrantPermissionResponse = ({
    [key: string]: unknown;
});

export type HandleGrantPermissionError = ({
    message: string;
});

export type HandleRevokePermissionData = {
    path: {
        identity: string;
        repo: string;
    };
};

export type HandleRevokePermissionResponse = ({
    [key: string]: unknown;
});

export type HandleRevokePermissionError = ({
    message: string;
});

export type HandleUpdatePermissionData = {
    body: UpdatePermissionRequest;
    path: {
        identity: string;
        repo: string;
    };
};

export type HandleUpdatePermissionResponse = ({
    [key: string]: unknown;
});

export type HandleUpdatePermissionError = ({
    message: string;
});

export type HandleListGitTokensData = {
    path: {
        identity: string;
    };
};

export type HandleListGitTokensResponse = (ListGitTokensResponseSuccess);

export type HandleListGitTokensError = ({
    message: string;
});

export type HandleCreateGitTokenData = {
    path: {
        identity: string;
    };
};

export type HandleCreateGitTokenResponse = (CreatedToken);

export type HandleCreateGitTokenError = ({
    message: string;
});

export type HandleRevokeGitTokenData = {
    body: RevokeGitTokenRequest;
    path: {
        identity: string;
    };
};

export type HandleRevokeGitTokenResponse = ({
    [key: string]: unknown;
});

export type HandleRevokeGitTokenError = ({
    message: string;
});

export type HandleListRepositoriesData = {
    query?: {
        /**
         * Maximum number of repositories to return
         */
        limit?: number;
        /**
         * Offset for the list of repositories
         */
        offset?: number;
    };
};

export type HandleListRepositoriesResponse = ({
    repositories: Array<RepositoryInfo>;
    offset: number;
});

export type HandleListRepositoriesError = ({
    message: string;
});

export type HandleCreateRepoData = {
    body: CreateRepositoryRequest;
};

export type HandleCreateRepoResponse = (CreateRepositoryResponseSuccess);

export type HandleCreateRepoError = ({
    message: string;
});

export type HandleDeleteRepoData = {
    path: {
        /**
         * The repository id
         */
        repo: string;
    };
};

export type HandleDeleteRepoResponse = ({
    [key: string]: unknown;
});

export type HandleDeleteRepoError = ({
    message: string;
} | {
    [key: string]: unknown;
});

export type HandleListGitTriggersData = {
    path: {
        /**
         * The repository id
         */
        repo: string;
    };
};

export type HandleListGitTriggersResponse = ({
    triggers: Array<GitRepositoryTrigger>;
});

export type HandleListGitTriggersError = ({
    message: string;
});

export type HandleCreateGitTriggerData = {
    body: {
        trigger: ({
    branches?: Array<(string)> | null;
    globs?: Array<(string)> | null;
    event: 'push';
});
        action: ({
    endpoint: string;
    action: 'webhook';
});
    };
    path: {
        /**
         * The repository id
         */
        repo: string;
    };
};

export type HandleCreateGitTriggerResponse = ({
    triggerId: string;
});

export type HandleCreateGitTriggerError = ({
    message: string;
});

export type HandleDeleteGitTriggerData = {
    path: {
        /**
         * The repository id
         */
        repo: string;
        /**
         * The trigger id
         */
        trigger: string;
    };
};

export type HandleDeleteGitTriggerResponse = ({
    [key: string]: unknown;
});

export type HandleDeleteGitTriggerError = ({
    message: string;
} | {
    [key: string]: unknown;
});

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

export type HandleDeployWebResponse = (FreestyleDeployWebSuccessResponseV2);

export type HandleDeployWebError = (FreestyleDeployWebErrorResponse);

export type HandleDeployWebV2Data = {
    body: FreestyleDeployWebPayloadV2;
};

export type HandleDeployWebV2Response = (FreestyleDeployWebSuccessResponseV2);

export type HandleDeployWebV2Error = (FreestyleDeployWebErrorResponse);

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
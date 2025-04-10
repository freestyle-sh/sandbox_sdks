import { type Client, createClient } from "@hey-api/client-fetch";
import * as sandbox_openapi from "../openapi/index.ts";

import type {
  AccessLevel,
  CreatedToken,
  CreateRepositoryResponseSuccess,
  DescribePermissionResponseSuccess,
  FreestyleCloudstateDeployRequest,
  FreestyleCloudstateDeploySuccessResponse,
  FreestyleDeployWebConfiguration,
  FreestyleDeployWebSuccessResponseV2,
  FreestyleExecuteScriptParamsConfiguration,
  FreestyleExecuteScriptResultSuccess,
  GitIdentity,
  HandleBackupCloudstateResponse,
  HandleCreateDomainVerificationResponse,
  HandleDeleteDomainVerificationResponse,
  HandleDeleteIdentityResponse,
  HandleDeleteRepoResponse,
  HandleGetExecuteRunResponse,
  HandleGetLogsResponse,
  HandleListDomainsResponse,
  HandleListDomainVerificationRequestsResponse,
  HandleListExecuteRunsResponse,
  HandleListRepositoriesResponse,
  HandleListWebDeploysResponse,
  HandleVerifyDomainError,
  HandleVerifyDomainResponse,
  ListGitTokensResponseSuccess,
  ListPermissionResponseSuccess,
  BuildOptions,
} from "../openapi/index.ts";

export type {
  AccessLevel,
  BuildOptions,
  CreatedToken,
  CreateRepositoryResponseSuccess,
  DescribePermissionResponseSuccess,
  FreestyleCloudstateDeployRequest,
  FreestyleCloudstateDeploySuccessResponse,
  FreestyleDeployWebConfiguration,
  FreestyleDeployWebSuccessResponseV2,
  FreestyleExecuteScriptParamsConfiguration,
  FreestyleExecuteScriptResultSuccess,
  GitIdentity,
  HandleBackupCloudstateResponse,
  HandleCreateDomainVerificationResponse,
  HandleDeleteDomainVerificationResponse,
  HandleDeleteIdentityResponse,
  HandleDeleteRepoResponse,
  HandleGetExecuteRunResponse,
  HandleGetLogsResponse,
  HandleListDomainsResponse,
  HandleListDomainVerificationRequestsResponse,
  HandleListExecuteRunsResponse,
  HandleListRepositoriesResponse,
  HandleListWebDeploysResponse,
  HandleVerifyDomainError,
  HandleVerifyDomainResponse,
  ListGitTokensResponseSuccess,
  ListPermissionResponseSuccess,
} from "../openapi/index.ts";

export class FreestyleSandboxes {
  private client: Client;
  constructor(options: {
    /**
     * The base URL for the API.
     */
    baseUrl?: string;
    /**
     * The API key to use for requests.
     */
    apiKey: string;
    /**
     * Custom Headers to be sent with each request.
     */
    headers?: Record<string, string>;
  }) {
    //@ts-expect-error Deno has a weird behavior thats patched here
    if (typeof Deno !== "undefined") {
      class FreestyleRequest extends Request {
        constructor(input, init) {
          if (init.client !== undefined) {
            console.warn("Unsupported client detected, using default client");
            delete init.client;
          }
          super(input, init);
        }
      }

      Request = FreestyleRequest;
    }
    this.client = createClient({
      baseUrl: options.baseUrl ?? "https://api.freestyle.sh",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        ...options.headers,
      },
    });
  }

  /**
   * Execute a script in a sandbox.
   */
  async executeScript(
    script: string,
    config?: FreestyleExecuteScriptParamsConfiguration
  ): Promise<FreestyleExecuteScriptResultSuccess> {
    const response = await sandbox_openapi.handleExecuteScript({
      client: this.client,
      body: {
        script,
        config: config,
      },
    });

    if (response.data) {
      return response.data;
    }
    throw {
      message: `Failed to execute script: \n\n${script}\n\nError:\n\n${JSON.stringify(
        response
      )}`,
      error: response.error,
    };
    // `Failed to execute script: \n\n${script}\n\nError:\n\n${JSON.stringify(
    //   response
    // )}`
  }

  /**
   * Deploy a Web project to a sandbox.
   */
  async deployWeb(
    source: sandbox_openapi.DeploymentSource,
    config?: Omit<FreestyleDeployWebConfiguration, "build"> & {
      build?:
        | BuildOptions
        | (Omit<BuildOptions, "command"> & {
            command: string | string[];
          });
    }
  ): Promise<FreestyleDeployWebSuccessResponseV2> {
    if (Array.isArray(config.build?.command)) {
      config.build.command = config.build.command.join(" && ") as string;
    }

    const response = await sandbox_openapi.handleDeployWebV2({
      client: this.client,
      body: {
        source: source,
        config: config as FreestyleDeployWebConfiguration,
      },
    });
    if (response.data) {
      return response.data;
    }
    throw new Error(
      `Failed to deploy web project\n\nStatus: ${response.response.status}\n\nMessage: ${response.error?.message}`
    );
  }

  /**
   * Deploy a Cloudstate project to a sandbox.
   */
  async deployCloudstate(
    body: FreestyleCloudstateDeployRequest
  ): Promise<FreestyleCloudstateDeploySuccessResponse> {
    const response = await sandbox_openapi.handleDeployCloudstate({
      client: this.client,
      body: body,
    });

    if (response.data) {
      return response.data;
    }

    throw new Error("Failed to deploy Cloudstate project");
  }

  /**
   * Get a backup of a Cloudstate project in a sandbox.
   * @param id The ID of the Cloudstate project.
   * @returns The backup of the Cloudstate project.
   * @throws An error if the backup could not be retrieved.
   */
  async backupCloudstate(id: string): Promise<HandleBackupCloudstateResponse> {
    const response = await sandbox_openapi.handleBackupCloudstate({
      client: this.client,
      path: {
        id: id,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error("Failed to get backup of Cloudstate project");
  }

  /**
   * Get logs for an execute run, or web deployment.
   * @param id The ID of the sandbox.
   * @returns The logs for the sandbox.
   * @throws An error if the logs could not be retrieved.
   */
  async getLogs(id: string): Promise<HandleGetLogsResponse> {
    const response = await sandbox_openapi.handleGetLogs({
      client: this.client,
      query: {
        deploymentId: id,
      },
      // path: {
      //   id: id,
      // },
    });
    if (response.data) {
      return response.data;
    }
    throw new Error("Failed to get logs for sandbox");
  }

  /**
   * Create a a domain verification request.
   * @param domain The domain to verify.
   * @returns The domain verification token.
   */
  async createDomainVerificationRequest(
    domain: string
  ): Promise<HandleCreateDomainVerificationResponse> {
    const response = await sandbox_openapi.handleCreateDomainVerification({
      client: this.client,
      body: {
        domain: domain,
      },
    });
    if (response.data) {
      return response.data;
    }

    throw new Error(response.error.message);
  }

  /**
   * Verify a domain. Note, this requires the domain verification token to be already set up.
   * @param domain The domain to verify.
   * @returns The domain verification request.
   */
  async verifyDomain(
    domain: string
  ): Promise<HandleVerifyDomainResponse | HandleVerifyDomainError> {
    const response = await sandbox_openapi.handleVerifyDomain({
      client: this.client,
      body: {
        domain: domain,
      },
    });
    if (response.data) {
      return response.data;
    }
    throw new Error(
      `Failed to verify domain ${domain}: ${response.error.message}`
    );
  }

  async listDomains(): Promise<HandleListDomainsResponse> {
    const response = await sandbox_openapi.handleListDomains({
      client: this.client,
    });
    if (response.data) {
      return response.data;
    }

    throw new Error(`Failed to list domains\n${response.error.message}`);
  }

  async listDomainVerificationRequests(): Promise<HandleListDomainVerificationRequestsResponse> {
    const response = await sandbox_openapi.handleListDomainVerificationRequests(
      {
        client: this.client,
      }
    );
    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to list domain verification requests\n${response.error.message}`
    );
  }

  async deleteDomainVerificationRequest(
    domain: string,
    verificationCode: string
  ): Promise<HandleDeleteDomainVerificationResponse> {
    const response = await sandbox_openapi.handleDeleteDomainVerification({
      client: this.client,
      body: {
        domain: domain,
        verificationCode: verificationCode,
      },
    });
    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to delete domain verification request for domain ${domain}: ${response.error.message}`
    );
  }

  async listWebDeployments(
    limit?: number,
    offset?: number
  ): Promise<HandleListWebDeploysResponse> {
    const response = await sandbox_openapi.handleListWebDeploys({
      client: this.client,
      query: {
        limit: limit ?? 10,
        offset: offset ?? 0,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to list web deployments\n${response.error.message}`
    );
  }

  async listExecuteRuns(
    limit?: number,
    offset?: number
  ): Promise<HandleListExecuteRunsResponse> {
    const response = await sandbox_openapi.handleListExecuteRuns({
      client: this.client,
      query: {
        limit: limit ?? 10,
        offset: offset ?? 0,
      },
    });
    if (response.data) {
      return response.data;
    }
    throw new Error(`Failed to list execute runs\n${response.error.message}`);
  }

  async getExecuteRun(id: string): Promise<HandleGetExecuteRunResponse> {
    const response = await sandbox_openapi.handleGetExecuteRun({
      client: this.client,
      path: {
        deployment: id,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to get execute run with ID ${id}: ${response.error.message}`
    );
  }

  /** Provision a wildcard certificate for domain. */
  async provisionWildcard(domain: string) {
    const response = await sandbox_openapi.handleVerifyWildcard({
      client: this.client,
      path: {
        domain,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to provision wildcard for domain ${domain}: ${response.error.message}`
    );
  }

  /**
   * Create a new git repository.
   *
   * @param name The name of the repository.
   */
  async createGitRepository(
    name: string
  ): Promise<CreateRepositoryResponseSuccess> {
    const response = await sandbox_openapi.handleCreateRepo({
      client: this.client,
      body: {
        name,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to create git repository ${name}: ${response.error}`
    );
  }

  /**
   * List git repositories.
   *
   * @param limit The maximum number of repositories to return. Defaults to 10.
   * @param offset The offset to start at. Defaults to 0.
   */
  async listGitRepositories(
    limit?: number,
    offset?: number
  ): Promise<HandleListRepositoriesResponse> {
    const response = await sandbox_openapi.handleListRepositories({
      client: this.client,
      query: {
        limit: limit ?? 10,
        offset: offset ?? 0,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(`Failed to list git repositories: ${response.error}`);
  }

  /**
   * Delete a git repository.
   *
   * @param repositoryId The ID of the repository to delete.
   */
  async deleteGitRepository(
    repositoryId: string
  ): Promise<HandleDeleteRepoResponse> {
    const response = await sandbox_openapi.handleDeleteRepo({
      client: this.client,
      path: {
        repo: repositoryId,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to delete git repository ${repositoryId}: ${response.error}`
    );
  }

  /**
   * Create a new git identity.
   */
  async createGitIdentity(): Promise<GitIdentity> {
    const response = await sandbox_openapi.handleCreateIdentity({
      client: this.client,
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(`Failed to create git identity: ${response.error}`);
  }

  /**
   * Delete a git identity.
   *
   * @param identityId The ID of the identity to delete.
   */
  async deleteGitIdentity(
    identityId: string
  ): Promise<HandleDeleteIdentityResponse> {
    const response = await sandbox_openapi.handleDeleteIdentity({
      client: this.client,
      path: {
        identity: identityId,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(`Failed to delete git identity: ${response.error}`);
  }

  /**
   * Grant a git identity access to a repository.
   *
   * @param repoId The ID of the repository to grant access to.
   * @param identityId The ID of the identity grant access to `repoId`.
   * @param permission The permission to grant.
   */
  async grantGitPermission(
    repoId: string,
    identityId: string,
    permission: AccessLevel
  ) {
    const response = await sandbox_openapi.handleGrantPermission({
      client: this.client,
      path: {
        repo: repoId,
        identity: identityId,
      },
      body: {
        permission,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to grant access to git identity ${identityId} for repository ${repoId}: ${response.error}`
    );
  }

  /**
   * Update a git identity's permissions on a repository.
   *
   * @param repoId The ID of the repository to update permissions for.
   * @param identityId The ID of the identity to whose access to update.
   * @param permission The permission to grant.
   */
  async updateGitPermission(
    repoId: string,
    identityId: string,
    permission: AccessLevel
  ): Promise<void> {
    const response = await sandbox_openapi.handleUpdatePermission({
      client: this.client,
      path: {
        repo: repoId,
        identity: identityId,
      },
      body: {
        permission,
      },
    });

    if (response.data) {
      return;
    }

    throw new Error(
      `Failed to update permission for git identity ${identityId} for repository ${repoId}: ${response.error}`
    );
  }

  /**
   * Revoke a git identity's access to a repository.
   *
   * @param repoId The ID of the repository revoke access to.
   * @param identityId The ID of the identity to revoke access from.
   */
  async revokeGitPermission(repoId: string, identityId: string): Promise<void> {
    const response = await sandbox_openapi.handleRevokePermission({
      client: this.client,
      path: {
        repo: repoId,
        identity: identityId,
      },
    });

    if (response.data) {
      return;
    }

    throw new Error(
      `Failed to revoke access to git identity ${identityId} for repository ${repoId}: ${response.error}`
    );
  }

  /**
   * List access permissions for a git identity.
   *
   * @param identityId The ID of the identity to list permissions for.
   */
  async listGitPermissions(
    identityId: string
  ): Promise<ListPermissionResponseSuccess> {
    const response = await sandbox_openapi.handleListPermissions({
      client: this.client,
      path: {
        identity: identityId,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to list permissions for git identity ${identityId}: ${response.error}`
    );
  }

  /**
   * Get the permission of a git identity on a repository.
   *
   * @param repoId The ID of the repository to check permissions for.
   * @param identityId The ID of the identity to check permissions for.
   */
  async getGitPermission(
    repoId: string,
    identityId: string
  ): Promise<DescribePermissionResponseSuccess> {
    const response = await sandbox_openapi.handleDescribePermission({
      client: this.client,
      path: {
        repo: repoId,
        identity: identityId,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to get permission for git identity ${identityId} on repository ${repoId}: ${response.error}`
    );
  }

  /**
   * Create a new git access token for an identity.
   *
   * @param identityId The ID of the identity to create the token for.
   */
  async createGitAccessToken(identityId: string): Promise<CreatedToken> {
    const response = await sandbox_openapi.handleCreateGitToken({
      client: this.client,
      path: {
        identity: identityId,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to create git access token: ${response.error.message}`
    );
  }

  /**
   * Revoke a git access token.
   *
   * @param identityId The ID of the identity the token belongs to.
   * @param tokenId The ID of the token to revoke.
   */
  async revokeGitAccessToken(
    identityId: string,
    tokenId: string
  ): Promise<void> {
    const response = await sandbox_openapi.handleRevokeGitToken({
      client: this.client,
      body: {
        tokenId,
      },
      path: {
        identity: identityId,
      },
    });

    if (response.data) {
      return;
    }

    throw new Error(
      `Failed to revoke git access token ${tokenId}: ${response.error.message}`
    );
  }

  /**
   * List git access tokens for an identity.
   *
   * @param identityId The ID of the identity to list tokens for.
   */
  async listGitAccessTokens(
    identityId: string
  ): Promise<ListGitTokensResponseSuccess> {
    const response = await sandbox_openapi.handleListGitTokens({
      client: this.client,
      path: {
        identity: identityId,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to list git access tokens: ${response.error.message}`
    );
  }
}

export * from "../openapi/types.gen.ts";

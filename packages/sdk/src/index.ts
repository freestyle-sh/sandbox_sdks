import { Client, createClient } from "@hey-api/client-fetch";
import * as sandbox_openapi from "../openapi/index.ts";

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
    config?: sandbox_openapi.FreestyleExecuteScriptParamsConfiguration
  ): Promise<sandbox_openapi.FreestyleExecuteScriptResultSuccess> {
    const response = await sandbox_openapi.handleExecuteScript({
      client: this.client,
      body: {
        script,
        config: config,
      },
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error(
        `Failed to execute script: \n\n${script}\n\nError:\n\n${JSON.stringify(
          response
        )}`
      );
    }
  }

  /**
   * Deploy a Web project to a sandbox.
   */
  async deployWeb(
    files: Record<
      string,
      {
        content: string;
        encoding?: string;
      }
    >,
    config?: sandbox_openapi.FreestyleDeployWebConfiguration
  ): Promise<sandbox_openapi.FreestyleDeployWebSuccessResponse> {
    const response = await sandbox_openapi.handleDeployWeb({
      client: this.client,
      body: {
        files,
        config: config,
      },
    });
    if (response.data) {
      return response.data;
    } else {
      throw new Error(
        `Failed to deploy web project\n\nStatus: ${response.response.status}\n\nMessage: ${response.error?.message}`
      );
    }
  }

  /**
   * Deploy a Cloudstate project to a sandbox.
   */
  async deployCloudstate(
    body: sandbox_openapi.FreestyleCloudstateDeployRequest
  ): Promise<sandbox_openapi.FreestyleCloudstateDeploySuccessResponse> {
    const response = await sandbox_openapi.handleDeployCloudstate({
      client: this.client,
      body: body,
    });
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Failed to deploy Cloudstate project");
    }
  }

  /**
   * Get a backup of a Cloudstate project in a sandbox.
   * @param id The ID of the Cloudstate project.
   * @returns The backup of the Cloudstate project.
   * @throws An error if the backup could not be retrieved.
   */
  async backupCloudstate(
    id: string
  ): Promise<sandbox_openapi.HandleBackupCloudstateResponse> {
    const response = await sandbox_openapi.handleBackupCloudstate({
      client: this.client,
      path: {
        id: id,
      },
    });
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Failed to get backup of Cloudstate project");
    }
  }

  /**
   * Get logs for an execute run, or web deployment.
   * @param id The ID of the sandbox.
   * @returns The logs for the sandbox.
   * @throws An error if the logs could not be retrieved.
   */
  async getLogs(id: string): Promise<sandbox_openapi.HandleGetLogsResponse> {
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
    } else {
      throw new Error("Failed to get logs for sandbox");
    }
  }

  /**
   * Create a a domain verification request.
   * @param domain The domain to verify.
   * @returns The domain verification token.
   */
  async createDomainVerificationRequest(
    domain: string
  ): Promise<sandbox_openapi.HandleCreateDomainVerificationResponse> {
    const response = await sandbox_openapi.handleCreateDomainVerification({
      client: this.client,
      body: {
        domain: domain,
      },
    });
    if (response.data) {
      return response.data;
    } else {
      throw new Error(
        `Failed to create domain verification request for domain ${domain}: ${response.error.message}`
      );
    }
  }

  /**
   * Verify a domain. Note, this requires the domain verification token to be already set up.
   * @param domain The domain to verify.
   * @returns The domain verification request.
   */
  async verifyDomain(
    domain: string
  ): Promise<
    | sandbox_openapi.HandleVerifyDomainResponse
    | sandbox_openapi.HandleVerifyDomainError
  > {
    const response = await sandbox_openapi.handleVerifyDomain({
      client: this.client,
      body: {
        domain: domain,
      },
    });
    if (response.data) {
      return response.data;
    } else {
      throw new Error(
        `Failed to verify domain ${domain}: ${response.error.message}`
      );
    }
  }

  async listDomains(): Promise<sandbox_openapi.HandleListDomainsResponse> {
    const response = await sandbox_openapi.handleListDomains({
      client: this.client,
    });
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Failed to list domains\n" + response.error.message);
    }
  }

  async listDomainVerificationRequests(): Promise<sandbox_openapi.HandleListDomainVerificationRequestsResponse> {
    const response = await sandbox_openapi.handleListDomainVerificationRequests(
      {
        client: this.client,
      }
    );
    if (response.data) {
      return response.data;
    } else {
      throw new Error(
        "Failed to list domain verification requests\n" + response.error.message
      );
    }
  }

  async deleteDomainVerificationRequest(
    domain: string,
    verificationCode: string
  ): Promise<sandbox_openapi.HandleDeleteDomainVerificationResponse> {
    const response = await sandbox_openapi.handleDeleteDomainVerification({
      client: this.client,
      body: {
        domain: domain,
        verificationCode: verificationCode,
      },
    });
    if (response.data) {
      return response.data;
    } else {
      throw new Error(
        `Failed to delete domain verification request for domain ${domain}: ${response.error.message}`
      );
    }
  }

  async listWebDeployments(
    limit?: number,
    offset?: number
  ): Promise<sandbox_openapi.HandleListWebDeploysResponse> {
    const response = await sandbox_openapi.handleListWebDeploys({
      client: this.client,
      query: {
        limit: limit ?? 10,
        offset: offset ?? 0,
      },
    });
    if (response.data) {
      return response.data;
    } else {
      throw new Error(
        "Failed to list web deployments\n" + response.error.message
      );
    }
  }

  async listExecuteRuns(
    limit?: number,
    offset?: number
  ): Promise<sandbox_openapi.HandleListExecuteRunsResponse> {
    const response = await sandbox_openapi.handleListExecuteRuns({
      client: this.client,
      query: {
        limit: limit ?? 10,
        offset: offset ?? 0,
      },
    });
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Failed to list execute runs\n" + response.error.message);
    }
  }

  async getExecuteRun(
    id: string
  ): Promise<sandbox_openapi.HandleGetExecuteRunResponse> {
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

  /**
   * Create a new git repository.
   *
   * @param name The name of the repository.
   */
  async createGitRepository(
    name: string
  ): Promise<sandbox_openapi.CreateRepoHandlerResponse> {
    const response = await sandbox_openapi.createRepoHandler({
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
  ): Promise<sandbox_openapi.ListRepositoriesHandlerResponse> {
    const response = await sandbox_openapi.listRepositoriesHandler({
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
  ): Promise<sandbox_openapi.DeleteRepoHandlerResponse> {
    const response = await sandbox_openapi.deleteRepoHandler({
      client: this.client,
      path: {
        repo: repositoryId,
      },
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error(
        `Failed to delete git repository ${repositoryId}: ${response.error}`
      );
    }
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
    } else {
      throw new Error(
        `Failed to provision wildcard for domain ${domain}: ${response.error.message}`
      );
    }
  }
}

export * from "../openapi/types.gen.ts";

import { type Client, createClient } from "@hey-api/client-fetch";
import * as sandbox_openapi from "../openapi/index.ts";

import type {
  AccessLevel,
  CreatedToken,
  CreateRepositoryResponseSuccess,
  DescribePermissionResponseSuccess,
  DevServer,
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
import { FreestyleDevServer } from "./dev-server.ts";

export type {
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
  DeploymentBuildOptions,
} from "../openapi/index.ts";

type Options = {
  /**
   * The base URL for the API.
   */
  baseUrl?: string;
  /**
   * The API key to use for requests.
   */
  apiKey?: string;
  /**
   * Custom Headers to be sent with each request.
   */
  headers?: Record<string, string>;
};

export class FreestyleSandboxes {
  private client: Client;
  options: Options;

  constructor(options?: Options) {
    this.options = options ?? {};

    if (!options?.apiKey) {
      this.options.apiKey = process.env.FREESTYLE_API_KEY;
    }
    if (!this.options.apiKey) {
      throw new Error(
        "No API key provided. Please set the FREESTYLE_API_KEY environment variable or configure apiKey when constructing FreestyleSandboxes."
      );
    }

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
      baseUrl: this.options?.baseUrl ?? "https://api.freestyle.sh",
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        ...this.options?.headers,
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
    config?: FreestyleDeployWebConfiguration
  ): Promise<FreestyleDeployWebSuccessResponseV2> {
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
   */
  async createGitRepository({
    name,
    public: pub = false,
    source,
  }: {
    name: string;
    public?: boolean;
    source?: {
      type: "git";
      url: string;
      branch?: string;
      depth?: number;
    };
  }): Promise<CreateRepositoryResponseSuccess> {
    const response = await sandbox_openapi.handleCreateRepo({
      client: this.client,
      body: {
        name,
        public: pub,
        source,
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
   */
  async listGitRepositories({
    limit = 10,
    offset = 0,
  }: {
    limit?: number;
    offset?: number;
  } = {}): Promise<HandleListRepositoriesResponse> {
    const response = await sandbox_openapi.handleListRepositories({
      client: this.client,
      query: {
        limit,
        offset,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(`Failed to list git repositories: ${response.error}`);
  }

  /**
   * Delete a git repository.
   */
  async deleteGitRepository({
    repoId,
  }: {
    repoId: string;
  }): Promise<HandleDeleteRepoResponse> {
    const response = await sandbox_openapi.handleDeleteRepo({
      client: this.client,
      path: {
        repo: repoId,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to delete git repository ${repoId}: ${response.error}`
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
   */
  async deleteGitIdentity({
    identityId,
  }: {
    identityId: string;
  }): Promise<HandleDeleteIdentityResponse> {
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
   */
  async grantGitPermission({
    repoId,
    identityId,
    permission,
  }: {
    repoId: string;
    identityId: string;
    permission: AccessLevel;
  }) {
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
   */
  async updateGitPermission({
    repoId,
    identityId,
    permission,
  }: {
    repoId: string;
    identityId: string;
    permission: AccessLevel;
  }): Promise<void> {
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
   */
  async revokeGitPermission({
    repoId,
    identityId,
  }: {
    repoId: string;
    identityId: string;
  }): Promise<void> {
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
   */
  async listGitPermissions({
    identityId,
  }: {
    identityId: string;
  }): Promise<ListPermissionResponseSuccess> {
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
   */
  async getGitPermission({
    repoId,
    identityId,
  }: {
    repoId: string;
    identityId: string;
  }): Promise<DescribePermissionResponseSuccess> {
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
   */
  async createGitAccessToken({
    identityId,
  }: {
    identityId: string;
  }): Promise<CreatedToken> {
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
   */
  async revokeGitAccessToken({
    identityId,
    tokenId,
  }: {
    identityId: string;
    tokenId: string;
  }): Promise<void> {
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
   */
  async listGitAccessTokens({
    identityId,
  }: {
    identityId: string;
  }): Promise<ListGitTokensResponseSuccess> {
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

  /**
   * List git triggers for a repository.
   */
  async listGitTriggers({
    repoId,
  }: {
    repoId: string;
  }): Promise<sandbox_openapi.HandleListGitTriggersResponse> {
    const response = await sandbox_openapi.handleListGitTriggers({
      client: this.client,
      path: {
        repo: repoId,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to list git triggers for repository ${repoId}: ${response.error.message}`
    );
  }

  /**
   * Create a git trigger for a repository.
   */
  async createGitTrigger({
    repoId,
    trigger,
    action,
  }: {
    repoId: string;
    trigger: sandbox_openapi.GitTrigger;
    action: sandbox_openapi.GitTriggerAction;
  }): Promise<sandbox_openapi.HandleCreateGitTriggerResponse> {
    const response = await sandbox_openapi.handleCreateGitTrigger({
      client: this.client,
      path: {
        repo: repoId,
      },
      body: {
        trigger,
        action,
      },
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(
      `Failed to create git trigger for repository ${repoId}: ${response.error.message}`
    );
  }

  /**
   * Delete a git trigger.
   */
  async deleteGitTrigger({ triggerId }: { triggerId: string }): Promise<void> {
    const response = await sandbox_openapi.handleDeleteGitTrigger({
      client: this.client,
      path: {
        trigger: triggerId,
      },
    });

    if (response.data) {
      return;
    }

    throw new Error(
      `Failed to delete git trigger ${triggerId}: ${response.error.message}`
    );
  }

  /**
   * Request a dev server for a repository. If a dev server is already running
   * for that repository, it will return a url to that server. Dev servers are
   * ephemeral so you should call this function every time you need a url. Do
   * not store the url in your database!
   */
  async requestDevServer(options: {
    /**
     * @deprecated
     */
    repoUrl?: string;
    repoId?: string;
    /**
     * @deprecated
     */
    repo?: string;
    baseId?: string;
    devCommand?: string;
    preDevCommandOnce?: string;
    envVars?: Record<string, string>;
    computeClass?: string;
    timeout?: number;
  }): Promise<FreestyleDevServer> {
    function formatHook(serverUrl: string, repoUrl: string) {
      const hook =
        serverUrl +
        "/__freestyle_dev_server/update/git?repo=" +
        encodeURIComponent(repoUrl);
      return hook;
    }

    const response = await sandbox_openapi.handleEphemeralDevServer({
      client: this.client,
      body: {
        ...options,
        // @ts-ignore
        repo: options.repoUrl,
      },
    });

    if (response.error) {
      throw new Error(
        // @ts-ignore
        `Failed to request dev server: ${response.error.message}`
      );
    }

    if (response.data.isNew) {
      const rId = options.repoId || options.repoUrl?.split("/").at(-1)!;

      await this.createGitTrigger({
        repoId: rId,
        action: {
          endpoint: formatHook(
            response.data?.url!,
            options.repoUrl || `https://git.freestyle.sh/${rId}`
          ),
          action: "webhook",
        },
        trigger: {
          event: "push",
        },
      });
    }

    if (!response.data) {
      throw new Error(`Failed to request dev server: ${response.error}`);
    }

    const data: typeof response.data & { codeServerUrl?: string } =
      response.data;

    const devServerInstance: DevServer = {
      repoId: options.repoId || options.repo || "",
      kind: "repo",
    };

    const client = this.client;

    const that = this;

    return {
      ...response.data,
      isNew: data.isNew,

      ephemeralUrl: data.ephemeralUrl ?? data.url,

      mcpEphemeralUrl: data.mcpEphemeralUrl ?? data.url + "/mcp",

      codeServerUrl:
        data.codeServerUrl ??
        (data.ephemeralUrl ?? data.url) +
          "/__freestyle_code_server/?folder=/template",

      async status() {
        const response = await sandbox_openapi.handleDevServerStatus({
          client,
          body: {
            devServer: devServerInstance,
          },
        });

        if (response.error) {
          throw new Error(`Failed to get status: ${response.error}`);
        }

        return {
          installing: response.data.installing,
          devRunning: response.data.devRunning,
        };
      },

      async commitAndPush(message: string) {
        const response = await sandbox_openapi.handleGitCommitPush({
          client,
          body: {
            devServer: devServerInstance,
            message,
          },
        });

        if (response.error) {
          throw new Error(`Failed to commit and push: ${response.error}`);
        }
      },

      async shutdown() {
        const response = await sandbox_openapi.handleShutdownDevServer({
          client,
          body: {
            devServer: devServerInstance,
          },
        });

        if (response.error) {
          throw new Error(`Failed to shutdown dev server: ${response.error}`);
        }

        return {
          success: response.data.success,
          message: response.data.message,
        };
      },

      fs: {
        async ls(path = "") {
          const response =
            await sandbox_openapi.handleReadFileFromEphemeralDevServer({
              client,
              path: {
                filepath: path,
              },
              body: {
                devServer: devServerInstance,
                encoding: "utf-8",
              },
            });

          if (response.error) {
            throw new Error(`Failed to list directory: ${response.error}`);
          }

          if (!response.data?.content) {
            return [];
          }

          if (response.data.content.kind === "directory") {
            return response.data.content.files;
          }

          return [];
        },

        async *watch(): AsyncGenerator<{
          eventType: string;
          filename: string;
        }> {
          const response = await that.fetch(
            "/ephemeral/v1/dev-servers/watch-files",
            {
              method: "POST",
              body: JSON.stringify({
                devServer: {
                  repoId: devServerInstance.repoId,
                  kind: devServerInstance.kind,
                },
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to fetch stream: ${response.status} ${response.statusText}`
            );
          }

          if (!response.body) {
            throw new Error("Failed to fetch stream: No response body");
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            let newlineIndex;
            while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
              const line = buffer.slice(0, newlineIndex).trim();
              buffer = buffer.slice(newlineIndex + 1);

              if (line) {
                yield JSON.parse(line) as {
                  eventType: string;
                  filename: string;
                };
              }
            }
          }

          if (buffer.trim()) {
            yield JSON.parse(buffer.trim()) as {
              eventType: string;
              filename: string;
            };
          }
        },

        async readFile(path: string, encoding = "utf-8") {
          const response =
            await sandbox_openapi.handleReadFileFromEphemeralDevServer({
              client,
              path: {
                filepath: path,
              },
              body: {
                devServer: devServerInstance,
                encoding,
              },
            });

          if (response.error) {
            throw new Error(`Failed to read file: ${response.error}`);
          }

          if (
            !response.data?.content ||
            response.data.content.kind !== "file"
          ) {
            throw new Error(`Not a file or file not found: ${path}`);
          }

          return response.data.content.content;
        },

        async writeFile(
          path: string,
          content: string | ArrayBuffer,
          encoding = "utf-8"
        ) {
          const contentStr =
            typeof content === "string"
              ? content
              : new TextDecoder(encoding).decode(content);

          const response =
            await sandbox_openapi.handleWriteFileFromEphemeralDevServer({
              client,
              path: {
                filepath: path,
              },
              body: {
                devServer: devServerInstance,
                content: contentStr,
                encoding,
              },
            });

          if (response.error) {
            throw new Error(`Failed to write file: ${response.error}`);
          }
        },
      },

      process: {
        async exec(cmd: string, background = false) {
          const response = await sandbox_openapi.handleExecOnEphemeralDevServer(
            {
              client,
              body: {
                devServer: devServerInstance,
                command: cmd,
                background,
              },
            }
          );

          if (response.error) {
            throw new Error(`Failed to execute command: ${response.error}`);
          }

          return {
            id: response.data.id,
            isNew: response.data.isNew,
            stdout: response.data.stdout,
            stderr: response.data.stderr,
          };
        },
      },
    };
  }

  fetch(path: string, init?: RequestInit) {
    const headers = new Headers(init?.headers);

    for (const [key, value] of Object.entries(this.options.headers ?? {})) {
      if (!headers.has(key)) {
        headers.append(key, value);
      }
    }

    if (!headers.has("Authorization")) {
      headers.append("Authorization", `Bearer ${this.options.apiKey}`);
    }

    if (!headers.has("Content-Type")) {
      headers.append("Content-Type", "application/json");
    }

    const url = new URL(
      path,
      this.options.baseUrl ?? "https://api.freestyle.sh"
    );

    return fetch(url, {
      ...(init ?? {}),
      headers,
    });
  }
}

export * from "../openapi/types.gen.ts";

// const { process, fs } = await api.requestDevServer({
//   repoId: "test",
// });
//
// await process.exec()
// await fs.ls()

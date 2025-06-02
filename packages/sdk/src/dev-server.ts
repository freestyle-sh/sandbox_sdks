export interface FreestyleDevServer {
  /**
   * The URL for the dev server's HTTP API.
   */
  ephemeralUrl: string;

  /**
   * The URL to the MCP endpoint for the dev server.
   */
  mcpEphemeralUrl: string;

  /**
   * The URL for the VSCode server running in the dev server.
   */
  codeServerUrl: string;

  /**
   * Whether the dev server was just created.
   */
  isNew: boolean;

  fs: FreestyleDevServerFilesystem;

  process: FreestyleDevServerProcess;

  devCommandRunning: boolean;
  installCommandRunning: boolean;

  /**
   * Get the status of the dev server
   */
  status(): Promise<{
    installing: boolean;
    devRunning: boolean;
  }>;

  /**
   * Commit and push changes to the dev server repository
   * @param message The commit message
   */
  commitAndPush(message: string): Promise<void>;

  /**
   * Shutdown the dev server
   */
  shutdown(): Promise<{
    success: boolean;
    message: string;
  }>;
}

export interface FreestyleDevServerFilesystem {
  /**
   * List files in the dev server directory
   */
  ls(path?: string): Promise<Array<string>>;

  /**
   * Read a file from the dev server
   * @param path The path to the file
   * @param encoding The encoding to use (defaults to utf-8)
   */
  readFile(path: string, encoding?: string): Promise<string>;

  /**
   * Write a file to the dev server
   * @param path The path to write to
   * @param content The content to write
   * @param encoding The encoding to use (defaults to utf-8)
   */
  writeFile(
    path: string,
    content: string | ArrayBufferLike,
    encoding?: string
  ): Promise<void>;

  watch(): AsyncGenerator<{ eventType: string; filename: string }>;
}

export interface FreestyleDevServerProcess {
  /**
   * Execute a command on the dev server
   * @param cmd The command to execute
   * @param background Whether to run the command in the background
   */
  exec(
    cmd: string,
    background?: boolean
  ): Promise<{
    id: string;
    isNew: boolean;
    stdout?: string[];
    stderr?: string[];
  }>;
}

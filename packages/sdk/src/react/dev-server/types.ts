export type RequestDevServerActions = {
    requestDevServer: (args: {
        repoUrl: string;
    }) => Promise<{ ephemeralUrl: string; devCommandRunning: boolean; installCommandRunning: boolean; }>;
};
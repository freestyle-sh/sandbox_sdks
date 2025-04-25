export type RequestDevServerActions = {
    requestDevServer: (args: {
        repoId: string;
    }) => Promise<{ ephemeralUrl: string; devCommandRunning: boolean; installCommandRunning: boolean; }>;
};
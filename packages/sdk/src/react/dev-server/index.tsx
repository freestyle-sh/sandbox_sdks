import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import React from "react";
import { RequestDevServerActions } from "./types";

const queryClient = new QueryClient();

export function DefaultLoadingComponent({
  installCommandRunning,
}: {
  devCommandRunning: boolean;
  installCommandRunning: boolean;
  serverStarting: boolean;
  iframeLoading: boolean;
}) {
  let loadingText = "Starting container...";

  if (installCommandRunning) {
    loadingText = "Installing dependencies...";
  } else {
    loadingText = "Starting dev server...";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      {loadingText}
    </div>
  );
}

export function FreestyleDevServer({
  loadingComponent,
  actions,
  repoId,
}: {
  repoId: string;
  loadingComponent?: (props: {
    devCommandRunning: boolean;
    installCommandRunning: boolean;
    serverStarting: boolean;
    iframeLoading: boolean;
  }) => React.ReactNode;
  actions: RequestDevServerActions;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <FreestyleDevServerInner
        loadingComponent={loadingComponent ?? DefaultLoadingComponent}
        repoId={repoId}
        actions={actions}
      />
    </QueryClientProvider>
  );
}

function FreestyleDevServerInner({
  repoId,
  loadingComponent,
  actions: { requestDevServer },
}: {
  repoId: string;
  loadingComponent: (props: {
    devCommandRunning: boolean;
    installCommandRunning: boolean;
    serverStarting: boolean;
    iframeLoading: boolean;
  }) => React.ReactNode;
  actions: RequestDevServerActions;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["dev-server", repoId],
    queryFn: async () => await requestDevServer({ repoId: repoId }),
    refetchInterval: 1000,
  });

  // keep reloading the iframe because there's a bug where the websocket
  // connection to the dev server is closed every 1 minute
  const ref = React.useRef<HTMLIFrameElement>(null);
  React.useEffect(() => {
    if (!data?.ephemeralUrl) return;

    const interval = setInterval(() => {
      if (ref.current) {
        ref.current.src = data.ephemeralUrl;
      }
    }, 45 * 1000);

    return () => clearInterval(interval);
  }, [data?.ephemeralUrl]);

  const [wasLoaded, setWasLoaded] = React.useState(false);
  const [iframeLoaded, setIframeLoaded] = React.useState(false);

  React.useMemo(() => {
    if (data?.devCommandRunning) {
      setWasLoaded(true);
    }
  }, [isLoading, data?.devCommandRunning]);

  React.useEffect(() => {
    ref.current?.addEventListener("load", () => {
      setIframeLoaded(true);
    });
  }, [ref]);

  if (isLoading) {
    return loadingComponent({
      devCommandRunning: false,
      installCommandRunning: false,
      serverStarting: true,
      iframeLoading: false,
    });
  }

  if (!data?.devCommandRunning && !wasLoaded) {
    return loadingComponent({
      devCommandRunning: data?.devCommandRunning ?? false,
      installCommandRunning: data?.installCommandRunning ?? false,
      serverStarting: false,
      iframeLoading: false,
    });
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "1fr",
        gridTemplateColumns: "1fr",
        width: "100%",
        height: "100%",
      }}
    >
      {
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            gridColumn: "1 / -1",
            gridRow: "1 / -1",
            visibility: iframeLoaded ? "hidden" : "visible",
          }}
        >
          {loadingComponent({
            devCommandRunning: data?.devCommandRunning ?? false,
            installCommandRunning: data?.installCommandRunning ?? false,
            serverStarting: false,
            iframeLoading: true,
          })}
        </div>
      }
      <iframe
        ref={ref}
        sandbox="allow-scripts allow-same-origin allow-forms"
        src={data.ephemeralUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          gridColumn: "1 / -1",
          gridRow: "1 / -1",
        }}
      />
    </div>
  );
}

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

export interface FreestyleDevServerHandle {
  refresh: () => void;
}

export const FreestyleDevServer = React.forwardRef<
  FreestyleDevServerHandle,
  {
    repoId: string;
    loadingComponent?: (props: {
      devCommandRunning: boolean;
      installCommandRunning: boolean;
      serverStarting: boolean;
      iframeLoading: boolean;
    }) => React.ReactNode;
    actions: RequestDevServerActions;
  }
>(({ loadingComponent, actions, repoId }, ref) => {
  return (
    <QueryClientProvider client={queryClient}>
      <FreestyleDevServerInner
        ref={ref}
        loadingComponent={loadingComponent ?? DefaultLoadingComponent}
        repoId={repoId}
        actions={actions}
      />
    </QueryClientProvider>
  );
});

const FreestyleDevServerInner = React.forwardRef<
  FreestyleDevServerHandle,
  {
    repoId: string;
    loadingComponent: (props: {
      devCommandRunning: boolean;
      installCommandRunning: boolean;
      serverStarting: boolean;
      iframeLoading: boolean;
    }) => React.ReactNode;
    actions: RequestDevServerActions;
  }
>(({ repoId, loadingComponent, actions: { requestDevServer } }, ref) => {
  const { data, isLoading } = useQuery({
    queryKey: ["dev-server", repoId],
    queryFn: async () => await requestDevServer({ repoId: repoId }),
    refetchInterval: 1000,
  });

  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [wasLoaded, setWasLoaded] = React.useState(false);
  const [iframeLoaded, setIframeLoaded] = React.useState(false);

  // Function to refresh the iframe
  const refreshIframe = React.useCallback(() => {
    if (iframeRef.current && data?.ephemeralUrl) {
      setIframeLoaded(false);
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = "";
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 50);
    }
  }, [data?.ephemeralUrl]);

  // Expose refresh method through ref
  React.useImperativeHandle(
    ref,
    () => ({
      refresh: refreshIframe,
    }),
    [refreshIframe],
  );

  React.useMemo(() => {
    if (data?.devCommandRunning) {
      setWasLoaded(true);
    }
  }, [isLoading, data?.devCommandRunning]);

  React.useEffect(() => {
    function loadHandle() {
      setIframeLoaded(true);
    }

    iframeRef.current?.addEventListener("load", loadHandle);
    return () => {
      iframeRef.current?.removeEventListener("load", loadHandle);
    };
  }, []);

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
        ref={iframeRef}
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
});

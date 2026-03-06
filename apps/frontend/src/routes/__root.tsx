import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import { Header } from "@/components/Header";
import { SocketProvider } from "@/components/SocketProvider";
import TanStackQueryProvider from "@/integrations/tanstack-query/root-provider";
import type { QueryClient } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: () => <div>Error...</div>,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <TanStackQueryProvider>
        <SocketProvider
          url={import.meta.env.VITE_WS_URL}
          options={{
            autoConnect: true,
            timeout: 5000,
            upgrade: true,
            reconnection: true,
            tryAllTransports: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ["websocket", "polling"],
          }}
        >
          <html lang="en">
            <head>
              <HeadContent />
            </head>
            <body>
              <div className="flex flex-col items-center justify-center h-full p-4">
                <Header />
                {children}
              </div>
              <Scripts />
            </body>
          </html>
        </SocketProvider>
      </TanStackQueryProvider>
    </JotaiProvider>
  );
}

import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import { Header } from "@/components/Header";
import type { QueryClient } from "@tanstack/react-query";
import { Provider } from "jotai";

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
    <Provider>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <TanStackQueryProvider>
            <div className="flex flex-col items-center justify-center h-full">
              <Header />
              {children}
            </div>
            <TanStackDevtools
              config={{
                position: "bottom-right",
              }}
              plugins={[
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          </TanStackQueryProvider>
          <Scripts />
        </body>
      </html>
    </Provider>
  );
}

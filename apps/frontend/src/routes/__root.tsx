import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router';

import appCss from '../styles.css?url';

import { Header } from '@/components/Header';
import TanStackQueryProvider from '@/integrations/tanstack-query/root-provider';
import type { QueryClient } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
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
        <html lang='en'>
          <head>
            <HeadContent />
          </head>
          <body>
            <div className='flex flex-col items-center justify-center h-full p-4'>
              <Header />
              {children}
            </div>
            <Scripts />
          </body>
        </html>
      </TanStackQueryProvider>
    </JotaiProvider>
  );
}

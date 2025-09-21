import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import ClerkContentWrapper from '../components/ClerkContentWrapper';
import useAuth from '../utils/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

console.log("Clerk Publishable Key:", PUBLISHABLE_KEY);

export default function RootLayout({children}) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <ClerkContentWrapper>
          {children}
        </ClerkContentWrapper>
      </QueryClientProvider>
      {/* <script src="https://fillout.com/embed/sdk.js"></script> */}
    </ClerkProvider>
  );
}
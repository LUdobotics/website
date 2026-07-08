import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/react';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(rootElement);

const app = <App isClerkConfigured={Boolean(clerkPublishableKey)} />;

root.render(
  <React.StrictMode>
    {clerkPublishableKey ? (
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        signInUrl="/account/sign-in"
        signUpUrl="/account/teacher/sign-up"
        afterSignOutUrl="/account/sign-in"
      >
        {app}
      </ClerkProvider>
    ) : (
      app
    )}
  </React.StrictMode>
);

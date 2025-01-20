import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { createCache, StyleProvider } from "@ant-design/cssinjs";

async function hydrate() {
  startTransition(() => {
    const cache = createCache();
    hydrateRoot(
      document,
      <StyleProvider cache={cache}>
        <StrictMode>
          <RemixBrowser />
        </StrictMode>
      </StyleProvider>
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}

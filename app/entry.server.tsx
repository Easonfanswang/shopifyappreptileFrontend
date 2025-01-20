import { renderToString } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import { type EntryContext } from "@remix-run/node";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const cache = createCache();

  function MainApp() {
    return (
      <StyleProvider cache={cache}>
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />
      </StyleProvider>
    );
  }

  let markup = renderToString(<MainApp />);
  const styleText = extractStyle(cache);

  markup = markup.replace("__ANTD__", styleText);

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

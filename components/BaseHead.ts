import { html } from "@sapling/sapling";

export function BaseHead({
  title = "Sapling",
  description = "Sapling is a modern SSR framework for simpler modern websites",
}) {
  return html`
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:image" content="/social.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#000" />
    <script
      src="https://cdn.jsdelivr.net/npm/iconify-icon@2.1.0/dist/iconify-icon.min.js"
      defer
    ></script>
    <style>
      :root {
        --color-background: #141414;
        --color-on-background: #fff;
        --color-primary: #fff;
        --color-on-primary: #000;
      }
      ::selection {
        background-color: var(--color-on-background);
        color: var(--color-background);
      }
    </style>
    <script>
      if ("serviceWorker" in navigator) {
        // Skip service worker registration on localhost
        const isLocalhost =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        if (!isLocalhost) {
          window.addEventListener("load", () => {
            navigator.serviceWorker
              .register("/sw.js")
              .then((registration) => {
                console.log("ServiceWorker registration successful");
              })
              .catch((err) => {
                console.log("ServiceWorker registration failed: ", err);
              });
          });
        }
      }
    </script>
  `;
}

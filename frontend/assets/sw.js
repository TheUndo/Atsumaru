// see below: just change imports by assignments
// import { cacheNames } from 'workbox-core'
// import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing'
// import { CacheableResponsePlugin } from 'workbox-cacheable-response'
// import {
//   NetworkFirst,
//   StaleWhileRevalidate,
//   NetworkOnly,
// } from 'workbox-strategies'
// import { ExpirationPlugin } from 'workbox-expiration'

const version = 1.4;

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js"
);
// Note: Ignore the error that Glitch raises about workbox being undefined.
workbox.setConfig({
  debug: false,
  globIgnores: ['api/**.*'],
});
// To avoid async issues, we load strategies before we call it in the event listener
workbox.loadModule("workbox-core");
workbox.loadModule("workbox-routing");
workbox.loadModule("workbox-cacheable-response");
workbox.loadModule("workbox-strategies");
workbox.loadModule("workbox-expiration");

const registerRoute = workbox.routing.registerRoute;
const { NetworkFirst, StaleWhileRevalidate, CacheFirst } = workbox.strategies;
const CacheableResponsePlugin =
  workbox.cacheableResponse.CacheableResponsePlugin;
const ExpirationPlugin = workbox.expiration.ExpirationPlugin;

// Cache page navigations (html) with a Network First strategy
registerRoute(
  // Check to see if the request is a navigation to a new page
  ({ request }) => request.mode === "navigate",
  // Use a Network First caching strategy
  new NetworkFirst({
    // Put all cached files in a cache named 'pages'
    cacheName: "pages",
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
  // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "worker",
  // Use a Stale While Revalidate caching strategy
  new StaleWhileRevalidate({
    // Put all cached files in a cache named 'assets'
    cacheName: "assets",
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

// Cache images with a Cache First strategy
registerRoute(
  // Check to see if the request's destination is style for an image
  ({ request }) => request.destination === "image",
  // Use a Cache First caching strategy
  new CacheFirst({
    // Put all cached files in a cache named 'images'
    cacheName: "images",
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      // Don't cache more than 50 items, and expire them after 30 days
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
      }),
    ],
  })
);

self.addEventListener("install", (evt) => {
  console.log("service worker has been installed");
  self.skipWaiting();
});
self.addEventListener("activate", (evt) => {
  console.log("service worker has been activated");
});

/* self.addEventListener("message", async (event) => {
    console.log(workbox)
    if (event.data && event.data.type === "CACHE_IMAGE") {
        const strategy = new NetworkFirst({ networkTimeoutSeconds: 10 });

        try {
            console.log(event.data.src)
            const response = await strategy.handle({
                request: new Request(event.data.src, {
                    mode: "no-cors"
                }),
                event: event
            });

            const res = await response.blob();

            event.
        } catch (e) {
            console.error(e);
        }
    }
});
 */

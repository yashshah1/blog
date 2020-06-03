importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);
if (workbox) {
  workbox.googleAnalytics.initialize();
  const { registerRoute } = workbox.routing;
  const { CacheFirst, StaleWhileRevalidate, NetworkFirst } = workbox.strategies;
  const { ExpirationPlugin } = workbox.expiration;
  registerRoute(
    ({ request }) => request.destination === "style",
    new StaleWhileRevalidate({
      cacheName: "css-cache",
    })
  );

  registerRoute(
    ({ request }) => request.destination === "script",
    new StaleWhileRevalidate({
      cacheName: "js-cache",
    })
  );

  registerRoute(
    ({ url }) => url.pathname.startsWith("/blog/articles/"),
    new StaleWhileRevalidate({
      cacheName: "post-cache",
    })
  );

  registerRoute(
    ({ url }) => url.pathname === "/blog/",
    new StaleWhileRevalidate({
      cacheName: "post-listing-cache",
    })
  );

  registerRoute(
    ({ request }) => request.destination === "image",
    new CacheFirst({
      cacheName: "image-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ],
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

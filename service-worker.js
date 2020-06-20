importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);
if (workbox) {
  workbox.googleAnalytics.initialize();
  const {
    routing: { registerRoute },
    strategies: { CacheFirst, StaleWhileRevalidate },
    cacheableResponse: { CacheableResponsePlugin },
    expiration: { ExpirationPlugin },
  } = workbox;

  self.addEventListener("install", function (e) {
    self.skipWaiting();
  });

  registerRoute(
    ({ request: { destination } }) => destination === "style",
    new StaleWhileRevalidate({
      cacheName: "css-cache",
      plugins: [
        new ExpirationPlugin({ maxEntries: 10 }),
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

  registerRoute(
    ({ request: { destination } }) => destination === "script",
    new StaleWhileRevalidate({
      cacheName: "js-cache",
      plugins: [
        new ExpirationPlugin({ maxEntries: 10 }),
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

  registerRoute(
    ({ url: { pathname } }) => pathname.startsWith("/blog/articles/"),
    new StaleWhileRevalidate({ cacheName: "post-cache" })
  );

  registerRoute(
    ({ url: { pathname } }) => pathname.startsWith("/blog/fonts/"),
    new StaleWhileRevalidate({
      cacheName: "font-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 5,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  registerRoute(
    ({ url: { pathname } }) => pathname === "/blog/",
    new StaleWhileRevalidate({ cacheName: "post-listing-cache" })
  );

  registerRoute(
    ({ request: { destination } }) => destination === "image",
    new CacheFirst({
      cacheName: "image-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

  registerRoute(
    ({ url: { origin } }) => origin === "https://fonts.googleapis.com",
    new StaleWhileRevalidate({ cacheName: "google-fonts-stylesheets" })
  );

  registerRoute(
    ({ url: { origin } }) => origin === "https://fonts.gstatic.com",
    new CacheFirst({
      cacheName: "google-fonts-webfonts",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

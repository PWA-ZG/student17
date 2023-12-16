const CACHE_NAME = "my-cache";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/index.html",
        "/manifest.json",
        "/icons/favicon.ico",
        // tu se dodaju datoteke koje zelimo cacheirati
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Listen for sync event
self.addEventListener("sync", (event) => {
  if (event.tag === "mySync") {
    event.waitUntil(
      self.registration.showNotification("Back Online!", {
        body: "You are back online!",
        icon: "/icons/favicon.ico",
      })
    );
  }
});

// Listen for push event
self.addEventListener("push", (event) => {
  const title = "Push Notification";
  const options = {
    body: "This is a push notification",
    icon: "/icons/favicon.ico",
    badge: "/badge.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

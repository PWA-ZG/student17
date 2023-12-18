const CACHE_NAME = "my-cache";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/index.html",
        "/manifest.json",
        "/icons/favicon.ico",
        "/otherSite.html",
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

self.addEventListener("notificationclick", (event) => {
  let notification = event.notification;
  notification.close();
  console.log("notificationclick", notification);
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clis) {
        if (clis && clis.length > 0) {
          clis.forEach(async (client) => {
            await client.navigate(notification.data.redirectUrl);
            return client.focus();
          });
        } else if (clients.openWindow) {
          return clients
            .openWindow(notification.data.redirectUrl)
            .then((windowClient) =>
              windowClient ? windowClient.focus() : null
            );
        }
      })
  );
});

self.addEventListener("notificationclose", function (event) {
  console.log("notificationclose", event);
});

// Listen for sync event
self.addEventListener("sync", (event) => {
  console.log("Back online!");
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
    badge: "/icons/favicon.ico",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

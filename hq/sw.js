// Capital Malaya HQ — shows phone notifications sent by the notify function.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Capital Malaya HQ", {
    body: d.body || "",
    icon: "/assets/icon.png",
    badge: "/assets/icon.png",
    data: { url: d.url || "/hq/" },
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/hq/";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    for (const c of cs) if (c.url.includes("/hq/") && "focus" in c) return c.focus();
    return self.clients.openWindow(url);
  }));
});

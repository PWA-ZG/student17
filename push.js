async function setupPushSubscription() {
  try {
    let reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (sub === null) {
      var publicKey =
        "BO1UhwyOfo9CiqyUjeENP0hGL3-Ev6sX5STmEXlDC6bMDlVXNsmeXj7hpWwfg1n6s2EG2w2hRsYIBIr_tkoq6bs";
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      let res = await fetch("/saveSubscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ sub }),
      });
      if (res.ok) {
        console.log(
          "Yay, subscription generated and saved:\n" + JSON.stringify(sub)
        );
      }
    } else {
      console.log("You are alreay subscribed:\n" + JSON.stringify(sub));
    }
  } catch (error) {
    console.log(error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

Notification.requestPermission(async function (res) {
  console.log("Request permission result:", res);
  if (res === "granted") {
    await setupPushSubscription();
  } else {
    console.log("User denied push notifs:", res);
  }
});

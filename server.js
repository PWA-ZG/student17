const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const fse = require("fs-extra");
const httpPort = 8081;

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(new Date().toLocaleString() + " " + req.url);
  next();
});

app.use(express.static(path.join(__dirname)));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/test", async function (req, res) {
  console.log(req.body);
  res.json({ success: true, message: req.body.message });
  await sendPushNotifications("Test uspješan!");
});

const webpush = require("web-push");

// Umjesto baze podataka, čuvam pretplate u datoteci:
let subscriptions = [];
const SUBS_FILENAME = "subscriptions.json";
try {
  subscriptions = JSON.parse(fs.readFileSync(SUBS_FILENAME));
} catch (error) {
  console.error(error);
}

app.post("/saveSubscription", function (req, res) {
  console.log(req.body);
  let sub = req.body.sub;
  subscriptions.push(sub);
  fs.writeFileSync(SUBS_FILENAME, JSON.stringify(subscriptions));
  sendPushNotifications("Subscription saved!");
  res.json({
    success: true,
  });
});

async function sendPushNotifications(message) {
  webpush.setVapidDetails(
    "mailto:dino.grzanov@fer.hr",
    "BO1UhwyOfo9CiqyUjeENP0hGL3-Ev6sX5STmEXlDC6bMDlVXNsmeXj7hpWwfg1n6s2EG2w2hRsYIBIr_tkoq6bs",
    "j9TOZ7P32oGmDd5BCHJavfbwXQTAwLREWvpqKkrWXrc"
  );
  subscriptions.forEach(async (sub) => {
    try {
      console.log("Sending notif to", sub);
      await webpush.sendNotification(
        sub,
        JSON.stringify({
          title: "Notification!",
          body: message,
          redirectUrl: "/index.html",
        })
      );
    } catch (error) {
      console.error(error);
    }
  });
}

app.listen(httpPort, function () {
  console.log(`HTTP listening on port: ${httpPort}`);
});

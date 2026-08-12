const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_CONTACT =
  process.env.VAPID_CONTACT || "mailto:your@email.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    VAPID_CONTACT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
} else {
  console.warn("VAPID keys are not configured.");
}

/* -----------------------------
   Push notification API
----------------------------- */

const subscriptions = [];

app.get("/vapid-public-key", (req, res) => {
  res.json({
    publicKey: VAPID_PUBLIC_KEY
  });
});

app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({
      error: "Invalid subscription"
    });
  }

  const exists = subscriptions.some(
    sub => sub.endpoint === subscription.endpoint
  );

  if (!exists) {
    subscriptions.push(subscription);
  }

  res.status(201).json({
    success: true
  });
});

app.post("/send", async (req, res) => {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return res.status(500).json({
      error: "VAPID keys are not configured."
    });
  }

  const payload = JSON.stringify({
    title: "Garden Care 🌿",
    body:
      req.body?.body ||
      "Today you're free, have fun and maybe play some golf! ⛳"
  });

  const results = await Promise.allSettled(
    subscriptions.map(subscription =>
      webpush.sendNotification(subscription, payload)
    )
  );

  res.json({
    sent: results.filter(
      result => result.status === "fulfilled"
    ).length
  });
});



const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));


app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});



app.listen(PORT, "0.0.0.0", () => {
  console.log(`Garden Care server running on port ${PORT}`);
});

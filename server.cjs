const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
const path = require("path");
const { Pool } = require("pg");

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
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
});

/* Create the subscriptions table automatically */

async function setupDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id SERIAL PRIMARY KEY,
      endpoint TEXT UNIQUE NOT NULL,
      subscription JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Database ready.");
}

setupDatabase().catch(err => {
  console.error("Database setup failed:", err);
});



app.get("/vapid-public-key", (req, res) => {
  res.json({
    publicKey: VAPID_PUBLIC_KEY
  });
});

app.post("/subscribe", async (req, res) => {
  try {
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({
        error: "Invalid push subscription"
      });
    }

    await pool.query(
      `
      INSERT INTO push_subscriptions (endpoint, subscription)
      VALUES ($1, $2)
      ON CONFLICT (endpoint)
      DO UPDATE SET subscription = EXCLUDED.subscription
      `,
      [
        subscription.endpoint,
        JSON.stringify(subscription)
      ]
    );

    res.status(201).json({
      success: true
    });

  } catch (error) {
    console.error("Subscription error:", error);

    res.status(500).json({
      error: "Could not save subscription"
    });
  }
});


app.post("/send", async (req, res) => {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return res.status(500).json({
      error: "VAPID keys are not configured"
    });
  }

  const payload = JSON.stringify({
    title: "Garden Care 🌿",
    body:
      req.body?.body ||
      "Today you're free, have fun and maybe play some golf! ⛳"
  });

  const { rows } = await pool.query(
    "SELECT id, subscription FROM push_subscriptions"
  );

  let sent = 0;

  for (const row of rows) {
    try {
      await webpush.sendNotification(
        row.subscription,
        payload
      );

      sent++;

    } catch (error) {

      console.error(
        "Push failed for subscription",
        row.id,
        error.statusCode
      );

      if (
        error.statusCode === 404 ||
        error.statusCode === 410
      ) {
        await pool.query(
          "DELETE FROM push_subscriptions WHERE id = $1",
          [row.id]
        );
      }
    }
  }

  res.json({
    sent
  });
});


const distPath = path.join(__dirname, "dist");


app.use(express.static(distPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Garden Care server running on port ${PORT}`
  );
});

# Garden Care Calendar

## Notifications

The app sends one natural-language notification for today:

- If jobs are due: **“Today you need to prune the roses, feed the camellias and check the hydrangeas.”**
- If nothing is due: **“Today you're free, have fun and maybe play some golf! ⛳”**

It also retains the earlier **3-days-before reminder**.

Only today's unfinished tasks are included in the daily message.

### Closed-app notifications

The normal browser Notification API cannot guarantee delivery when the site is completely closed. `server.cjs` is included as a starter Web Push backend for reliable closed-app notifications.

Install its dependencies with `npm install express web-push cors`, configure VAPID keys, store subscriptions in a database, and run a daily server scheduler/cron to send the daily message and the 3-day reminder.

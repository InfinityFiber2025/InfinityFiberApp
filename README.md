Infinity Fiber — Demo static package

This is a small demo that simulates a digital bank with two areas:
 - Client app (route: #/app) — shows client dashboard and simple demo actions.
 - Admin panel (route: #/admin) — shows clients, bank vault and pending transactions.

How to use locally:
 - unzip and open index.html in a browser (no server necessary).
 - or run a simple static server (recommended) e.g. `python -m http.server` in the folder.

Admin demo credentials:
 - username: DanielKascher
 - password: K@scher123

Notes:
 - This is a static demo (no real backend). Data lives inside app.js (demoData).
 - You can edit demoData in app.js to add clients, balances and transactions.

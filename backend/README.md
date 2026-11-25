# Tengesa Marketplace

A responsive corporate website and starter marketplace application for Tengesa Marketplace, using Node.js, Express, MongoDB Atlas, ImageKit and optional SMTP email.

## Brand palette

The supplied Tengesa app screenshot uses a bright white surface, royal/cobalt blue, and vivid green. The website translates that identity into:
- Navy: `#0A192F`
- Deep navy: `#112240`
- Emerald: `#10B981`
- Green hover: `#059669`
- White: `#FFFFFF`
- Light surface: `#F8FAFC`
- Tengesa blue accent: `#1E40AF`
- Soft blue surface: `#EEF2FF`

## Requirements

- Node.js 20+
- MongoDB Atlas database
- ImageKit account (optional until image uploads are used)
- SMTP account (optional; inquiry records are still saved if email is not configured)

## Run locally

1. Extract the ZIP.
2. Open the project folder in VS Code.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Fill in your credentials (never commit `.env`).
6. Run `npm start`.
7. Open `http://localhost:10000`.

If you do not have MongoDB configured yet, the server still starts, but database-backed API routes return a clear `503` response. The static corporate pages remain available.

## MongoDB Atlas setup

1. Sign in to MongoDB Atlas and create a free/shared cluster.
2. In **Database Access**, create a database username and a strong password.
3. In **Network Access**, add the IP addresses that need database access. For Render, use the network access configuration recommended by MongoDB Atlas/Render; `0.0.0.0/0` allows access from anywhere and should only be used with a strong database password and least-privilege database user.
4. Select **Connect → Drivers**, choose Node.js, and copy the `mongodb+srv://` connection string.
5. Replace the username, password and database name in `MONGODB_ATLAS_URI`. URL-encode special characters in the password.
6. Set `MONGODB_ATLAS_URI` in your local `.env` and later in Render's environment settings.

On first successful connection, the app seeds four demo listings only when the listings collection is empty. Replace these sample listings with genuine products before launch.

## ImageKit setup

1. Create an ImageKit account.
2. Find the Public Key, Private Key and URL Endpoint in the developer/API settings.
3. Add them to `.env` or Render environment variables.
4. The admin page requests short-lived upload authentication from `/api/imagekit-auth`. The private key stays on the server.
5. ImageKit delivery URLs can use automatic WebP transformation through `?tr=f-auto`.

## SMTP setup

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM`. Use credentials/app passwords from your SMTP provider. The app sends an internal alert to `SUPPORT_EMAIL` and a confirmation to the sender. If SMTP is not configured, inquiry submission is still stored and the API reports that email notification was not sent.

## Admin portal

Open `/admin.html`. Set a strong `ADMIN_PASSWORD` in the environment. Enter it in the admin login form. Admin API requests use a bearer token stored in that browser session. This is a simple password-based starter admin gate; for a public production marketplace, replace it with individual accounts, hashed passwords, MFA, role-based access control, audit logs and secure session cookies.

## Render deployment

1. Push the complete project to a GitHub repository. Do not commit `.env`.
2. In Render, choose **New → Blueprint** and connect the repository. Render reads `render.yaml`.
3. Add all required secret environment values in the Render dashboard.
4. Wait for deployment and check `/api/health`.
5. Add your custom domain under the Render service settings and configure the DNS records shown by Render.
6. Test contact submission, listing retrieval, admin access, and image upload.

## Important launch checklist

- Change all contact placeholders, social links and support email if required.
- Change `ADMIN_PASSWORD` to a long unique secret.
- Use HTTPS and a real SMTP provider.
- Configure CORS only for your actual production origin if the frontend/API are split across domains.
- Add privacy policy, terms, moderation, listing verification and abuse-reporting workflows before accepting public users.
- Do not advertise payment, delivery or escrow unless those services are actually implemented.

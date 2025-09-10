BEM Demo – Firebase Hosting + Functions

This project serves a static site from Firebase Hosting and an Express.js API via a Firebase Functions v2 onRequest handler.

Run locally

Prerequisites:
- Node.js 18+ (Node 20 recommended)
- Firebase CLI: npm i -g firebase-tools

Install dependencies (first time only):
```bash
cd functions && npm i
```

Start emulators from the project root:
```bash
cd ..
firebase emulators:start --only functions,hosting
```

Default local URLs:
- Hosting: http://localhost:5000
- API base: http://localhost:5000/api
- Swagger UI: http://localhost:5000/api-docs

Example requests:
```bash
# Intro
curl http://localhost:5000/api/v1/demo/intro

# Hello World proxy
curl http://localhost:5000/api/v1/demo/hello-world
```

Notes:
- The sample public/index.html includes __/firebase/init.js?useEmulator=true for local testing. For production, remove the ?useEmulator=true query or set it to false.
- If ports are in use, the emulator UI will display the actual ports. Use those in place of 5000 above.

Deploy

From the project root:
```bash
firebase deploy --only functions,hosting
```

After deploy, your endpoints will be available at:
- https://<your-project-id>.web.app/api/...
- Swagger UI: https://<your-project-id>.web.app/api-docs

Scripts

Root package.json:
- npm run emulate → firebase emulators:start --only functions,hosting
- npm run deploy → firebase deploy --only functions,hosting



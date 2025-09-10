const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Local swagger definition reused from project root for consistency
const swaggerOptions = require('./swaggerDef');

const app = express();
const api = express.Router();

// CORS middleware using official package (restrict to GitHub Pages + localhost)
const allowedOrigins = [
  'https://waterthatfrozen.github.io',
  /^http:\/\/localhost(?::\d+)?$/
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow curl/non-browser
    const isAllowed = allowedOrigins.some((entry) =>
      typeof entry === 'string' ? entry === origin : entry.test(origin)
    );
    return isAllowed ? callback(null, true) : callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  maxAge: 86400,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Constants
const DEMO_SERVICE = 'https://siit-smart-city.azurewebsites.net';

// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API routes (mounted under /api below)
/**
 * @openapi
 * /v1/demo/intro:
 *   get:
 *     summary: Introduction endpoint for the demo API
 *     description: Returns a simple message with a suggested demo path and current timestamp.
 *     tags:
 *       - Demo
 *     responses:
 *       200:
 *         description: Intro information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IntroResponse'
 */
api.get('/v1/demo/intro', (_req, res) => {
  res.send({
    message: 'Hello world, this is API demo for dummies',
    demoPath: 'try to use /api/v1/demo/hello-world',
    currentTime: new Date().getTime(),
  });
});

/**
 * @openapi
 * /v1/demo/redirect:
 *   get:
 *     summary: Redirects to the hello-world endpoint
 *     tags:
 *       - Demo
 *     responses:
 *       302:
 *         description: Redirect to /v1/demo/hello-world
 *         headers:
 *           Location:
 *             description: Target URL for the redirect
 *             schema:
 *               type: string
 */
api.get('/v1/demo/redirect', (_req, res) => {
  res.redirect('/api/v1/demo/hello-world');
});

/**
 * @openapi
 * /v1/demo/hello-world:
 *   get:
 *     summary: Proxies to a remote Hello World service and wraps the response
 *     tags:
 *       - Demo
 *     responses:
 *       200:
 *         description: Wrapped response from the remote service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HelloWorldResponse'
 *       500:
 *         description: Upstream or internal error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
api.get('/v1/demo/hello-world', async (_req, res) => {
  try {
    const url = DEMO_SERVICE + '/api/helloWorld';
    const response = await axios.get(url);
    res.send({
      message: 'custom message from BEM',
      data: response.data,
    });
  } catch (err) {
    res.status(500).send({
      message: 'failed by others',
      error: err?.message || err,
    });
  }
});

// Mount API under /api so Hosting rewrite path matches
app.use('/api', api);

// Export HTTPS function (v1) for broad emulator compatibility
exports.api = functions.https.onRequest(app);



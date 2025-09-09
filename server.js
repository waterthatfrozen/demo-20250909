const http = require('http'),
    express = require('express'),
    dotenv = require('dotenv'),
    bodyParser = require('body-parser'),
    axios = require('axios');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./swaggerDef');
const app = express();
const specs = swaggerJsdoc(swaggerOptions);
dotenv.config();

// Define constant path and server port
const PATH = __dirname
const PORT = process.env.SERVER_PORT || 3500
const DEMO_SERVICE = 'https://siit-smart-city.azurewebsites.net'

// parse request body as JSON object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// open server
app.use(express.static(PATH));
http.createServer(app).listen(PORT, () => {
    console.log('listening at http://localhost:'+PORT);
});

app.get('/', (_req, res) => { res.sendFile('./index.html') });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
app.get('/api/v1/demo/intro', (_req, res) => { res.send({
    message: 'Hello world, this is API demo for dummies',
    demoPath: 'try to use /api/v1/demo/hello-world',
    currentTime: new Date().getTime()
})});

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
app.get('/api/v1/demo/redirect', (_req, res) => {
    res.redirect('/api/v1/demo/hello-world');
})

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
app.get('/api/v1/demo/hello-world', (_req, res) => {
    const url = DEMO_SERVICE + '/api/helloWorld'
    axios.get(url)
    .then(response => res.send({
        message: 'custom message from BEM',
        data: response.data
    })).catch(err => res.status(500).send({
        message: 'failed by others',
        error: err
    }));
});
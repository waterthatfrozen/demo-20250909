// swaggerDef.js for Cloud Functions
const path = require('path');
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Demo BEM API Documentation',
        version: '1.0.0',
        description: 'Documentation for Demo BEM API',
    },
    components: {
        schemas: {
            IntroResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Hello world, this is API demo for dummies' },
                    demoPath: { type: 'string', example: 'try to use /api/v1/demo/hello-world' },
                    currentTime: { type: 'integer', format: 'int64', example: 1717449600000 }
                },
                required: ['message', 'demoPath', 'currentTime']
            },
            HelloWorldResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'custom message from BEM' },
                    data: { type: 'object' }
                },
                required: ['message', 'data']
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'failed by others' },
                    error: { type: 'object' }
                },
                required: ['message']
            }
        }
    },
    servers: [
        {
            url: '/api',
            description: 'Firebase Hosting rewrite to Cloud Functions',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, 'index.js')],
};

module.exports = options;



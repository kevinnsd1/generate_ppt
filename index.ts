import express, { Application, Request, Response, NextFunction } from 'express';
import client from 'prom-client';
import bodyParser from 'body-parser';
import customReportApiRoute from './server/routes/custom_report_route';
// ...
// app.use('/api/v1/custom_report', customReportApiRoute);
import errorHandler from './server/middleware/error';
import successHandler from './server/middleware/success';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// Load config file
dotenv.config({ path: './server/config/config.env' });
const env = process.env.NODE_ENV || 'development';
const config = require('./server/config/config.json')[env];

const app: Application = express();

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
const PORT: number = config.port;

// Register custom report route
app.use('/api/v1/custom_report', customReportApiRoute);

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: 'custom-report',
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Swagger definition
const swaggerDefinition = {
    info: {
        title: 'REST API for my App',
        version: '1.0.0',
        description: 'This is the REST API for my product',
    },
    host: 'localhost:5432',
    basePath: '/api/v1',
};

app.use((req: Request, res: Response, next: NextFunction) => {
    (req as any).settings = app.settings;
    next();
});

app.use(express.static(path.resolve('./public')));

// CORS configuration
const corsOptionsDelegate = (req: any, callback: (err: Error | null, options?: cors.CorsOptions) => void) => {
    const corsOptions: cors.CorsOptions = { origin: true };
    callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    next();
});

app.get('/metrics', (req: Request, res: Response) => {
    res.setHeader('Content-Type', register.contentType);
    register.metrics().then((data) => res.send(data));
});

// app.use('/api/v1/custom_report', customReportApiRoute);
app.use(errorHandler);
app.use(successHandler);

app.listen(PORT, () => {
    console.log(`Server is listening to port ${PORT}`);
});

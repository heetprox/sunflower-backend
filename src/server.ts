import express from 'express';
import http from 'http';
import router from "./router/router";
import { runServer } from './lib/db';
import cookieParser from 'cookie-parser';
import useCors from "cors";
import { cors } from './lib/utils';
import { errorHandler } from './handlers/errorHandler';
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(useCors(cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

app.all('/api/auth/*}', toNodeHandler(auth));

app.use(router);

app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.url });
});

app.use(errorHandler);

// Start server
runServer(server);
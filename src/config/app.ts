import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';

const app = express();
app.use(graphqlUploadExpress());

export default app;

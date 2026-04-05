const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const routes = require('./routes');
app.use('/api', routes);

// Centralized error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});

module.exports = app;
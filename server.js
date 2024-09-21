require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose')
const app = express();
const userRoutes = require('./routes/user.routes');
const friendRequestRoutes = require('./routes/friendRequest.routes')
const glimpseRoutes = require('./routes/glimpse.routes');
const port = 3000;
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Server Status</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    margin-top: 50px;
                }
            </style>
        </head>
        <body>
            <h1>Server is Running</h1>
            <p>Welcome to the Glimpse server!</p>
        </body>
        </html>
    `);
});

//Connect to MongoDB
mongoose.connect("mongodb+srv://graylwi2593:Gray2592003@glimpse.cl9pe.mongodb.net/Glimpse?retryWrites=true&w=majority&appName=glimpse")
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`server is running at port ${port}`)
        });
    })
    .catch((error) => {
        console.error("Connection to mongoDB failed");
    });



app.use('/api/users', userRoutes);
app.use('/api/friend', friendRequestRoutes);
app.use('/api/glimpse', glimpseRoutes);

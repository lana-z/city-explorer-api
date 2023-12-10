'use strict';

//let weather = require('./data/weather.json');

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use( cors() );

const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
//const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


class Forecast {
    constructor(weatherData){
        this.description = weatherData.weather.description;
        this.date = weatherData.datetime;
    }
}

app.get('/', (request, response) => {
    let data = { message: "Goodbye World"};
    response.json(data);
});

app.get("/weather", getWeatherData);

async function getWeatherData(request, response) {
    let lat = request.query.lat;
    let lon = request.query.lon;

    let axiosResponse = await axios.get('https://api.weatherbit.io/v2.0/forecast/daily', {
        params: {
            lat: lat,
            lon: lon,
            key: process.env.WEATHER_API_KEY
        }
    });

    let forecastArray = axiosResponse.data.data.map(thing => {
           return new Forecast(thing);
    })
    console.log(forecastArray)
    response.json(forecastArray);
 
}


app.get("*", (request, response) => {
    response.status(404).send("Page Not Avaiable");
});


app.use( (error, request, response, next) => {
  response.status(500).send(error.message);
});
'use strict';

let weather = require('./data/weather.json');

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use( cors() );

const PORT = process.env.PORT || 3000;

class Forecast {
    constructor(low, high, conditions, date){
        this.description = `Low of ${low}, high of ${high} with ${conditions}`;
        this.date = `${date}`;
    };
};

app.get('/', (request, response) => {
    let data = { message: "Goodbye World"};
    response.json(data);
});


app.get('/broken', (request,response) => {
  throw new Error("Something is totally broken");
})


app.get("/weather", (request, response) => {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery;
   
    if (!lat || !lon || !searchQuery){
        return response.status(400).json({error: "Please complete all the required information"})
      }

    let foundCity = weather.find(city => {
        return (
            city.lat === lat ||
            city.lon === lon ||
            city.city_name.toLowerCase() === searchQuery.toLowerCase()
        );
    });
 
    let forecastArray = foundCity.data.map(
        thing => (
            new Forecast(thing.low_temp, thing.high_temp, thing.weather.description, thing.datetime)
        )
    )
    response.json(forecastArray)

});


app.get("*", (request, response) => {
    response.status(404).send("Page Not Avaiable");
});


app.use( (error, request, response, next) => {
  response.status(500).send(error.message);
});


app.listen(
    PORT,
    () => console.log(`Listening on port ${PORT}`)
);
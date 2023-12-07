'use strict';

let weather = require('./data/weather.json');

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use( cors() );

const PORT = process.env.PORT || 3000;


app.get('/', (request, response) => {
    let data = { message: "Goodbye World"};
    response.json(data);
});


app.get('/broken', (request,response) => {
  throw new Error("Something is totally broken");
})

const Forecast = (weather) => {
    return weather.map((X, index)=>{
        const date = {date: X.data.datetime};
        return date;
    });
}

app.get("/weather", (request, response) => {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery;
    console.log(Forecast(weather))
    if (
        lat == null || lon == null|| searchQuery == null ||
        lat == undefined || lon == undefined || searchQuery == undefined
      ){
        return response.status(400).json({error: "Please complete all the required information"})
      }

    let foundCity = weather.find(city => {
        return (
            city.lat === lat ||
            city.lon === lon ||
            city.city_name.toLowerCase() === searchQuery.toLowerCase()
        );
    });
    response.json(foundCity)

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
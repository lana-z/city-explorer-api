
let weather = require('./data/weather.json');

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





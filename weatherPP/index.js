const http = require("http")
const fs = require("fs")
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8")
// console.log(homeFile)

const replaceVal = (tempval, orgval) => {
    let temprature = tempval.replace("{%tempval%}", (orgval.main.temp - 273.15).toFixed(2))
    temprature = temprature.replace("{%tempMin%}", (orgval.main.temp_min - 273.15).toFixed(2))
    temprature = temprature.replace("{%tempMax%}", (orgval.main.temp_max - 273.15).toFixed(2))
    temprature = temprature.replace("{location}", orgval.name)
    temprature = temprature.replace("{%country%}", orgval.sys.country)
    temprature = temprature.replace("{%tempstatus%}", orgval.weather[0].main)
    return temprature;
}

const server = http.createServer((req, res) => {
    if(req.url === "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?lat=16.17&lon=75.65&appid=8b255b9d5864c85e6606d97e3d994d27')
        .on('data', function (chunk) {
        const objData = JSON.parse(chunk)
        const arrData = [objData]
        const celsius = arrData[0].main.temp - 273.15
        const roundedCelsius = celsius.toFixed(2)
        const realTimeValue = arrData.map((val) => replaceVal(homeFile, val)).join("")
        res.write(realTimeValue)
        // console.log(realTimeValue)
        // console.log(arrData)

    })
    .on('end', function (err) {
    if (err) return console.log('connection closed due to errors', err);
    res.end()
 
    console.log('end');
});
    }
})

server.listen(3000, "127.0.0.1")
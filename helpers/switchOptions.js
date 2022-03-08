const {prompt} = require("inquirer")
const {readInput} = require('./readInput')
const { default: axios } = require('axios')
const {writeDB} = require('./dbActions')

const renderInfo = ({name,country,lat,lon,temp,temp_min,temp_max,weatherLike}) => {
    const klvToCel = (kelvin) => (kelvin - 273.15).toFixed(2)
    console.clear();

    console.log(`${"City information".green}\n`);

    console.log(`${"City:".green} ${name}, ${country}`);
    console.log(`${"Lat:".green} ${lat}`);
    console.log(`${"Lng:".green} ${lon}`);  
    console.log(`${"Temp:".green} ${klvToCel(temp)}`);  
    console.log(`${"Min Temp:".green} ${klvToCel(temp_min)}`);  
    console.log(`${"Max Temp:".green} ${klvToCel(temp_max)}`);  
    console.log(`${"What's the weather like:".green} ${weatherLike}\n`);  
}

const switchOptions = async(value,browsingHistory) => {
    switch (value) {
        case 1:{
            try {
                const {desc} = await readInput("City:",(value)=> value.trim().length === 0 ? "Please Enter a valid city" : true)
                const {data:{list}} = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${desc}&appid=${process.env.WEATHER_API_KEY}`)
                
                const question = {
                    type: "list",
                    name: "option",
                    message: "Select place:",
                    choices: [
                        {
                            value:0, 
                            name:`${"0.".green} Exit`
                        },
                        ...list.map(({name,id,sys:{country}},index) => ({
                            value:id,
                            name:`${`${index+1}`.green}. ${name}, ${`${country}`.green}`
                        }))
                    ]
                }

                const {option} = await prompt([question])
                
                if(option === 0) break;

                const {name,sys,coord,main,weather} = list.find(({id}) => id === option)
                browsingHistory.addNewHistory(`${name}, ${sys.country}`)
                renderInfo({
                    name,
                    country:sys.country,
                    lat:coord.lat,
                    lon:coord.lon,
                    temp:main.temp,
                    temp_min:main.temp_min,
                    temp_max:main.temp_max,
                    weatherLike:weather[0].main
                })

            } catch (err) {
                console.log(`${"ERROR".red}: ${err.response.data.message}`)
            }
        } break
        case 2: {
            browsingHistory.getHistory.forEach(({name},index) => {
                console.log(`${`${index+1}`.green}. ${name}`)
            });
        } break;
    }

    await writeDB(browsingHistory)

    return true
}

module.exports = {switchOptions}
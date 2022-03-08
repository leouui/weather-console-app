const {prompt} = require('inquirer')
const {switchOptions} = require('./helpers/switchOptions')
const {readInput} = require('./helpers/readInput')
const {readDB} = require('./helpers/dbActions')
const BrowsingHistory = require('./models/BrowsingHistory')
require("colors")
require('dotenv').config();

const data = readDB()
const browsingHistory = new BrowsingHistory(data !== null ? JSON.parse(data).history : [])

const question = {
    type: "list",
    name: "option",
    message: "What do you want to do?",
    choices: [
        {value:1,name:`${`${1}.`.green} Search a city`},
        {value:2,name:`${`${2}.`.green} Browsing History`},
        {value:0, name:`${"0.".green} Exit`}
    ]
}

const app = () => {
    console.clear()
    console.log("=====================".green);
    console.log("  Select an option".white)
    console.log("=====================\n".green);

    prompt([question])
        .then(({option}) => option !== 0 && switchOptions(option,browsingHistory))
        .then(isDifZero => isDifZero && readInput(`Press ${`ENTER`.green} to continue`))
        .then(continueLoop => continueLoop && app())
        .catch(err => console.log(err))
}

app()
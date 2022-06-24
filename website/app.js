


/* Global Variables */
const zip = document.querySelector('#zip')
const generate = document.querySelector('#generate')
const feelings = document.querySelector('#feelings')
const thisDate = document.querySelector('#thisDate')
const temp = document.querySelector('#temp')
const content = document.querySelector('#content')
const errors = document.querySelector('#errors')

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
const example = 'https://api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}'
const baseURI = 'https://api.openweathermap.org/data/2.5/weather?zip='
const apiKey  = '&appid=3a6f932d936dc40b2f40cc03e4125cfb'

generate.addEventListener('click',(event)=>{
    event.preventDefault()
    const madeURI = `${baseURI}${zip.value}${apiKey}`
    console.log(madeURI)
    getData(madeURI) //getData is an asynchronous promise, so it can be cained with a .then and use the data that was returned
    .then((data)=>{
        cureData(data) //cureData is to remove specific information
        //this second .then is used after we've gotten the required data
        .then((info)=>{
            postData("/add", info)
            .then((data)=>{
                retrieveData("/all")
                .then((data)=>{
                    updatedUI(data)
                })
            })
        })
    })
})

//the url is a placeholder
const getData = async(url)=>{
    try{
        const result = await fetch(url);
        //result will await and have a value that is a json file
        const data = await result.json()
        if(data.cod == 200)//cod is a key in the json file
        {
            //console.log(data)
            return data

        }else{
            console.log(data.message) //message is a key in the json file
        }
        
    }catch(e){
        //if any error happens
        console.log(e)
    }
}


const cureData = async (data)=>{
    try{
        if(data.message){
         const info = data.message
            //console.log(data)
            return info
        }else{
            //info is what we require to send to the data
            const info  = {
                date: newDate,
                feelings: feelings.value,
                temp: data.main.temp
            }
            //console.log(info)
            return info
        }
    }catch(er){
        console.error(er)
    }
    
}

const postData = async(url="", data={})=>{
    try{
        const result = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        return result
    }catch(er){console.error(er)}
}

const retrieveData = async (url)=>{
    const data = await fetch(url)
    try{
        const respond = await data.json()
        console.log(respond)
        return respond
    }catch(err){
        console.error(err)
    }
}

const updatedUI = async (data)=>{
    const request = await data //we do not use data.json because the data is already an object so we dont need to make it .json
    if(request.date){ //if date then make this changes
        document.querySelector('#entryHolder').style.cssText = `
        display:block;
        font-size: 2rem;
        border: 1px solid white;
        padding: 1rem;`
        thisDate.innerHTML = "Date: " + request.date
        temp.innerHTML =  "Temperature: " + Math.round(request.temp)+ 'degrees';
        content.innerHTML = request.feelings? "Content: "+ request.feelings: "what's your mood today?"
        //document.querySelector('#entryHolder').style.display = "none"
        document.querySelector('#errors').style.display = "none"
        console.log(request)


    }else{
        document.querySelector('#entryHolder').style.display = "none"
        document.querySelector('#errors').style.cssText = `
        display:block;
        font-size: 2rem;
        border: 1px solid white;
        padding: 1rem;
        `
        document.querySelector('#errors').innerHTML = 'incorrect entry'
        
    }
    
}

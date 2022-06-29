//const data=require('./clfa-9a00b028.openapi.yaml')
const yaml=require('js-yaml')
const fs =require('fs')
const apiURL = process.env.APIURL;

 (()=>{
   
    /* 
    Anonymous function loads the manually generated YAML config and changes the
    title, description and URL to the name of the FunctionApp
    */
    let x = yaml.load(fs.readFileSync('../../api/openapi.yaml', 'utf8'))
    
     x.servers[0].url = `${apiURL}/api`
     
    fs.writeFile(`./../swagger.json`, JSON.stringify(x), function(err){
        if(err) throw err
        console.log("complete")
    })
})()

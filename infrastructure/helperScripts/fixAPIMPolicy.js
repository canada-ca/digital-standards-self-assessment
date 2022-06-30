const fs = require('fs')
const newString = process.env.FANAME

fs.readFile('../policy.xml', "utf8", (err, data)=>{
    if(err){
        console.log(err)
    }else{
    let newFile = data.replace("backend-id", `base-url="https://${newString}.azurewebsites.net/api"`)
    fs.writeFile("../newPolicy.xml", newFile, function(err){
        if(err) throw err
        console.log("complete")
    })
    }
}) 







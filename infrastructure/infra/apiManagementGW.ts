import * as pulumi from "@pulumi/pulumi";
import * as azure_native from "@pulumi/azure-native";
import { Output } from "@pulumi/pulumi";
const env = process.env.ENV_NAME
const project = process.env.PROJECT_NAME
const random = Math.floor(Math.random() * 1000)
let apimName = ""; 

if(!process.env.CURRENT_APIM){
    apimName = `${env}-${project}-apim-${random}`
}else {
    apimName = process.env.CURRENT_APIM
}
// create the API management Gateway service
export const apiManagementService =(location: Output<string>, resourceGroup: Output<string>)=>{ 
    
    const apiMgmtGw = new azure_native.apimanagement.ApiManagementService(`${apimName}`, {
    location: location,
    publisherEmail: "noreply@tbs-sct.gc.ca",
    publisherName: "No Reply",
    resourceGroupName: resourceGroup,
    serviceName: `${apimName}`,
    sku: {
        capacity: 0,
        name: "Consumption",
    },
    
}); return apiMgmtGw}



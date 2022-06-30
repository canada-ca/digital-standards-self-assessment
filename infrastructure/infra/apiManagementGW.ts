import * as pulumi from "@pulumi/pulumi";
import * as azure_native from "@pulumi/azure-native";
import { Output } from "@pulumi/pulumi";
const env = process.env.ENV_NAME
const random = Math.floor(Math.random() * 1000)
// create the API management Gateway service
export const apiManagementService =(location: Output<string>, resourceGroup: Output<string>)=>{ 
    
    const apiMgmtGw = new azure_native.apimanagement.ApiManagementService(`${env}dssa-apim-400`, {
    location: location,
    publisherEmail: "noreply@tbs-sct.gc.ca",
    publisherName: "No Reply",
    resourceGroupName: resourceGroup,
    serviceName: `${env}-dssa-apim-400`,
    sku: {
        capacity: 0,
        name: "Consumption",
    },
    
}); return apiMgmtGw}



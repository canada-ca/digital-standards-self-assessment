import * as resources from "@pulumi/azure-native/resources";
import * as pulumi from "@pulumi/pulumi";
const env = process.env.ENV_NAME
export const resourceGroup = new resources.ResourceGroup(`${env}-dssa-rg-`, {location: "canadacentral"});

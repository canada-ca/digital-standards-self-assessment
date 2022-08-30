import * as resources from "@pulumi/azure-native/resources";
import * as pulumi from "@pulumi/pulumi";
const env = process.env.ENV_NAME
const project = process.env.PROJECT_NAME

export const resourceGroup = new resources.ResourceGroup(`${env}-${project}-rg-`, {location: "canadacentral"});

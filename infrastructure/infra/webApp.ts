import * as web from "@pulumi/azure-native/web";
import { Output } from "@pulumi/pulumi";
import * as pulumi from "@pulumi/pulumi";
const env = process.env.ENV_NAME
const project = process.env.PROJET_NAME
//Build app service plan and deploy a function app to the account

export const newAppPlan = ({
  resourceGroup,
}: {
  resourceGroup: Output<string>;
}) => {
  const plan = new web.AppServicePlan(`${env}-${project}-asp-`, {
    resourceGroupName: resourceGroup,
    sku: { name: "Y1", tier: "Dynamic" },
  });
  return plan;
};

export const functionApp = ({
  resourceGroup,
  plan,
  storageConnectionString,
  // codeBlobUrl,
  dbAccount,
  masterKey,
  port,
  mongoDB,
  corsURLs,
  primaryConnectionString
}: {
  resourceGroup: Output<string>;
  plan: Output<string>;
  storageConnectionString: Output<string>;
  // codeBlobUrl: Output<string>;
  dbAccount: Output<string>;
  masterKey: Output<string>;
  port: string;
  mongoDB: Output<string>;
  corsURLs: Output<string>[];
  primaryConnectionString: Output<string>;
}) => {
  const newFa = new web.WebApp(`${env}-${project}-fa-`, {
    resourceGroupName: resourceGroup,
    serverFarmId: plan,
    kind: "functionapp",

    siteConfig: {
      cors: {
          allowedOrigins: corsURLs
      },
      appSettings: [
        { name: "AzureWebJobsStorage", value: storageConnectionString },
        { name: "MONGO_CONNECTION_STRING", value: primaryConnectionString },
        { name: "MONGODB_PROTOCAL", value: "mongodb" },
        { name: "MONGODB_USER", value: dbAccount },
        { name: "MONGODB_PORT", value: dbAccount },
        { name: "MONGODB_PASS", value: masterKey },
        { name: "MONGODB_URL", value: pulumi.interpolate`${dbAccount}.mongo.cosmos.azure.com:${port}?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${dbAccount}@` },
        { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
        { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
        { name: "WEBSITE_NODE_DEFAULT_VERSION", value: "~16" },
        { name: "WEBSITE_RUN_FROM_PACKAGE", value: "1" },
      ],
      http20Enabled: true,
      nodeVersion: "~16",
    },
  });
   
  return newFa;
};

export const addSlotConfig = (
  rgName: Output<string>,
  appName: Output<string>
) => {
  const webSlot = new web.WebAppSlotConfigurationNames(`${env}-${project}-wascn`, {
    name: appName,
    resourceGroupName: rgName,
    appSettingNames: [
      "MONGO_CONNECTION_STRING",
      "MONGODB_PROTOCAL",
      "MONGODB_USER",
      "MONGODB_PORT",
      "MONGODB_PASS",
      "MONGODB_URL",
      "MONGODB_DBNAME",
    ],
  });
};


import { resourceGroup } from "./infra/resourcegroup";
import * as cosmos from "./infra/cosmos";
import * as storage from "./infra/storage";
import * as webApp from "./infra/webApp";
import * as webAPIGW from "./infra/apiManagementGW"


/*
-- Resource Group section --
*/
const newResourceGroup = resourceGroup;

/*
-- DocumentDB Account and MongoDB section --
We export endpoint information here to be used with the function app
*/
const newDBAccount = cosmos.dbAccount;


const newMongoDB = cosmos.mongoDB;
const newEndPoint = cosmos.endpoint(newDBAccount);
const newKeySet = cosmos.keys(newResourceGroup.name, newDBAccount.name);
const newConnectionStringSet = cosmos.connectionStrings(
  newResourceGroup.name,
  newDBAccount.name
);
const primaryConnectionString = cosmos.connectionString(newConnectionStringSet);
const newMasterKey = cosmos.masterKey(newKeySet);

/*
-- Storage and Static Web Container section --
*/
const newStorageAccount = storage.newAzStorage;
const newStaticContainer = storage.newStorageContainer;
const storageKey = storage.storageKey(newResourceGroup.name, newStorageAccount.name)
const staticWebUrl = storage.getStaticURL(newStorageAccount.name, newResourceGroup.name)


/*
-- WebApp and Function App section --
We pass all the endpoint data from the Mongo creation step to create the env variable
Pulumi uploads the functions to the container as part of this step
*/
const newFunctionAppContainer = storage.codeContainer;

const newStorageConnectionString = storage.storageConnString(
  newResourceGroup.name,
  newStorageAccount.name
);
const newWebAPIGW = webAPIGW.apiManagementService(newResourceGroup.location, newResourceGroup.name);


const newWebApp = webApp.newAppPlan({ resourceGroup: resourceGroup.name });
const newFA = webApp.functionApp({
  resourceGroup: newResourceGroup.name,
  plan: newWebApp.id,
  //codeBlobUrl: blobUrl,
  dbAccount: newDBAccount.name,
  port: "10255",
  masterKey: newMasterKey,
  mongoDB: newMongoDB.name,
  corsURLs: [staticWebUrl, newWebAPIGW.gatewayUrl],
  storageConnectionString: newStorageConnectionString,
  primaryConnectionString: primaryConnectionString
});

const newSlotConfig = webApp.addSlotConfig(resourceGroup.name, newFA.name)


//We export this to the pipeline so Azure DevOps can upload the UI data to the static webstorage
export const storageAccountName = newStorageAccount.name;
export const storageID = newStorageAccount.id
export const faName = newFA.name
export const resourceGroupName = newResourceGroup.name
export const apimName = newWebAPIGW.name
export const apimGWURL = newWebAPIGW.gatewayUrl
export const saKey = storageKey
export const cosmosDB = primaryConnectionString
export const staticURL = staticWebUrl
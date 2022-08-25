//Build Storage account, then deploy container to the account, extract key information for other resources
import { resourceGroup } from "./resourcegroup";
import * as storage from "@pulumi/azure-native/storage"
import { getConnectionString, signedBlobReadUrl } from "../helperScripts/helpers";
import {  Output } from "@pulumi/pulumi";
import * as pulumi from "@pulumi/pulumi";


const env = process.env.ENV_NAME
const project = process.env.PROJECT_NAME


export const newAzStorage = new storage.StorageAccount(`${env}${project}stacct`, {
  resourceGroupName: resourceGroup.name,
  sku: { name: storage.SkuName.Standard_LRS },
  kind: storage.Kind.StorageV2,
  enableHttpsTrafficOnly: true,
});
export const newStorageContainer = new storage.StorageAccountStaticWebsite(
  `${env}-${project}-static-container`,
  {
    accountName: newAzStorage.name,
    resourceGroupName: resourceGroup.name,
    indexDocument: "index.html",
  }
);

// Function code archives will be stored in this container.
export const codeContainer = new storage.BlobContainer("zips", {
  resourceGroupName: resourceGroup.name,
  accountName: newAzStorage.name,
});


// extract connection string by use of helper function

export const storageConnString = (
  resourceGroup: Output<string>,
  storageName: Output<string>
) => {
  return getConnectionString(resourceGroup, storageName);
};

export function storageKey(resourceGroupName: pulumi.Input<string>,
  accountName: pulumi.Input<string>){
    const storageAccountKeys = storage.listStorageAccountKeysOutput({
      resourceGroupName,
      accountName,
    });
    const primaryStorageKey = storageAccountKeys.keys[0].value;
    return primaryStorageKey
}

export function getStaticURL(accountName: pulumi.Input<string>, resourceGroupName:pulumi.Input<string>){
  const output = storage.getStorageAccountOutput({accountName, resourceGroupName})
  return output.primaryEndpoints.web
}
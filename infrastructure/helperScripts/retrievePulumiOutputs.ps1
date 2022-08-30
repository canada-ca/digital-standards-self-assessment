<#
This script connects to the stack for the given environment and exports the following names to the pipeline
Function App Name - initialize function apps later in pipeline 
Storage Account Name - Upload static content later in pipeline
ResourceGroup Name 
#>


$env:PULUMI_SKIP_UPDATE_CHECK="true"



$env:RG_NAME="$(az group list -o tsv --query "[] | [? contains(name, 'pulumi')] | [0].name")"
$env:AZURE_STORAGE_ACCOUNT = $(az storage account list -o tsv --query  "[] | [? contains(name, 'pulumi')] | [0].name")
$env:sContainerName = az storage container list --account-name $env:AZURE_STORAGE_ACCOUNT  -o tsv --query "[] | [? contains(name, 'pulumi')] | [0].name"
$env:AZURE_STORAGE_KEY=$(az storage account keys list --account-name $env:AZURE_STORAGE_ACCOUNT -g $env:RG_NAME -o tsv --query '[0].value')

pulumi login azblob://$env:sContainerName
pulumi stack select $env:ENV_NAME

<#
We grab the outputs from the stack and then pass that variable into the pipeline variable command
#>
$faName = pulumi stack output -s $env:ENV_NAME faName
$projectStorageAccount = pulumi stack output -s $env:ENV_NAME storageAccountName
$projectRgName = pulumi stack output -s $env:ENV_NAME resourceGroupName
$projectAPIGW = pulumi stack output -s $env:ENV_NAME apimGWURL
$projectAPIGWName = pulumi stack output -s $env:ENV_NAME apimName

$projectSaKey = pulumi stack output -s $env:ENV_NAME saKey
$projectdbString = pulumi stack output -s $env:ENV_NAME cosmosDB
$projectStaticURL = pulumi stack output -s $env:ENV_NAME staticURL


Write-Host "##vso[task.setvariable variable=faName;isSecret=true;isOutput=true]$faName"
Write-Host "##vso[task.setvariable variable=projectSA;isSecret=true;isOutput=true]$projectStorageAccount"
Write-Host "##vso[task.setvariable variable=projectRG;isSecret=true;isOutput=true]$projectRgName"
Write-Host "##vso[task.setvariable variable=projectAPIGW;isSecret=true;isOutput=true]$projectAPIGW"
Write-Host "##vso[task.setvariable variable=projectAPIGWName;isSecret=true;isOutput=true]$projectAPIGWName"

Write-Host "##vso[task.setvariable variable=projectSaKey;isSecret=true;isOutput=true]$projectSaKey"
Write-Host "##vso[task.setvariable variable=projectDBString;isSecret=true;isOutput=true]$projectdbString"
Write-Host "##vso[task.setvariable variable=projectStaticURL;isOutput=true]$projectStaticURL"
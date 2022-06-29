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
$dssaStorageAccount = pulumi stack output -s $env:ENV_NAME storageAccountName
$dssaRgName = pulumi stack output -s $env:ENV_NAME resourceGroupName
$dssaAPIGW = pulumi stack output -s $env:ENV_NAME apimGWURL
$dssaAPIGWName = pulumi stack output -s $env:ENV_NAME apimName

$dssaSaKey = pulumi stack output -s $env:ENV_NAME saKey
$dssadbString = pulumi stack output -s $env:ENV_NAME cosmosDB
$dssaStaticURL = pulumi stack output -s $env:ENV_NAME staticURL


Write-Host "##vso[task.setvariable variable=faName;isOutput=true]$faName"
Write-Host "##vso[task.setvariable variable=dssaSA;isOutput=true]$dssaStorageAccount"
Write-Host "##vso[task.setvariable variable=dssaRG;isOutput=true]$dssaRgName"
Write-Host "##vso[task.setvariable variable=dssaAPIGW;isOutput=true]$dssaAPIGW"
Write-Host "##vso[task.setvariable variable=dssaAPIGWName;isOutput=true]$dssaAPIGWName"

Write-Host "##vso[task.setvariable variable=dssaSaKey;isOutput=true]$dssaSaKey"
Write-Host "##vso[task.setvariable variable=dssaDBString;isOutput=true]$dssadbString"
Write-Host "##vso[task.setvariable variable=dssaStaticURL;isOutput=true]$dssaStaticURL"
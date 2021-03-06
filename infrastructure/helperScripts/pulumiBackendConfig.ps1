
<#
In this script we build the back end where the state referred to as stack will will be stored
This script creates a new Resource group, storage account and keyvault with an encryption key
#>

$env:PULUMI_SKIP_UPDATE_CHECK="true"

$random = Get-Random -Maximum 1000
$location="canadacentral"
$env:RG_NAME="$(az group list -o tsv --query "[] | [? contains(name, 'pulumi-')] | [0].name")"
if($env:RG_NAME.length -eq 0){$env:RG_NAME="gc-rg-pulumi-$random"}



function setResources{

    $saName = $(az storage account list -g $env:RG_NAME -o tsv --query  "[] | [? contains(name, 'pulumi')] | [0].name")

    $env:AZURE_STORAGE_KEY=$(az storage account keys list --account-name $saName -g $env:RG_NAME -o tsv --query '[0].value')
    $env:AZURE_STORAGE_ACCOUNT = $saName
    if( "true" -ne (az storage container exists -n $env:sContainerName -o tsv)){
        az storage container create -n pulumi
        $env:sContainerName = $(az storage container list --account-name $saName  -o tsv --query "[] | [? contains(name, 'pulumi')] | [0].name")

    }else{$env:sContainerName = $(az storage container list --account-name $saName  -o tsv --query "[] | [? contains(name, 'pulumi')] | [0].name")
}

}

function setPulumiBackend{
    pulumi login azblob://$env:sContainerName
    # selects the stack -c creates it if it doesn't exist
    pulumi stack select $env:ENV_NAME -c

    pulumi config set azure-native:location canadacentral

}

if("true" -eq (az group exists -n $env:RG_NAME)){
   
     setResources
     setPulumiBackend

    }else{
       
        az group create -n $env:RG_NAME -l $location
        az storage account create -g $env:RG_NAME -n "sadssapulumistate$random" -l $location --sku Standard_LRS
        
        setResources
        setPulumiBackend
        
        }
<#
Expose the Keyvault, Storage key and Storage account name to the pipeline so the infrastructure deployment can 
call our self hosted stack in blob storage
#>
Write-Host "##vso[task.setvariable variable=saAccount;isOutput=true]$env:AZURE_STORAGE_ACCOUNT"
Write-Host "##vso[task.setvariable variable=container;isOutput=true]$env:sContainerName"
Write-Host "##vso[task.setvariable variable=storageKey;isOutput=true]$env:AZURE_STORAGE_KEY"
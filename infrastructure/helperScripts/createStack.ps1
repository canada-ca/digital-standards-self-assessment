$env:RG_NAME="$(az group list -o tsv --query "[] | [? contains(name, 'pulumi-')] | [0].name")"
$saName = $(az storage account list -g $env:RG_NAME -o tsv --query  "[] | [? contains(name, 'pulumi')] | [0].name")
$env:sContainerName = $(az storage container list --account-name $saName  -o tsv --query "[] | [? contains(name, 'pulumi')] | [0].name")

pulumi login azblob://$env:sContainerName
# selects the stack -c creates it if it doesn't exist
pulumi stack select $env:ENV_NAME -c

pulumi config set azure-native:location canadacentral
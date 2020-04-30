Write-Host "Start running nuget_pack.ps1"

$versionNumber = [Environment]::GetEnvironmentVariable("CustomBuildNumber", "User");
$exitCode = 0;

Write-Host "Nuget Pack ..\PowerBI.ReportAuthoring.nuspec -Version "$versionNumber
& nuget pack "..\PowerBI.ReportAuthoring.nuspec" -Version $versionNumber

$exitCode += $LASTEXITCODE;

exit $exitCode
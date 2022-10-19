Write-Host "Start running nuget_pack.ps1"

$versionNumber = (Get-Content "package.json") -join "`n" | ConvertFrom-Json | Select -ExpandProperty "version"
$exitCode = 0;

Write-Host "Nuget Pack PowerBI.ReportAuthoring.nuspec -Version "$versionNumber
& nuget pack "PowerBI.ReportAuthoring.nuspec" -Version $versionNumber

$exitCode += $LASTEXITCODE;

exit $exitCode
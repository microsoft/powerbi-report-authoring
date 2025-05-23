$exitCode = 0;
Write-Host "start: npm run test"
& npm run test
Write-Host "done: npm run test"
$exitCode += $LASTEXITCODE;
if ($exitCode -ne 0) {
  Write-Host "Failed to run npm test"
  exit $exitCode
}
exit $exitCode
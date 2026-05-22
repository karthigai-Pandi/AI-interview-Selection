$source = "C:\Users\USER'\Desktop\projects\AI interview Selection"
$dest = "C:\temp\ai-interview-selection-copy"
if (Test-Path -LiteralPath $dest) { Remove-Item -LiteralPath $dest -Recurse -Force }
New-Item -ItemType Directory -Path $dest | Out-Null
Get-ChildItem -LiteralPath $source -Force | Where-Object { $_.Name -ne 'node_modules' } | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $dest -Recurse -Force
}

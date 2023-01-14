@echo off
setlocal
call tsc
call rollup -c
pushd dist\js
del index.js
rmdir /s /q cloak
rmdir /s /q common-controls
popd
endlocal
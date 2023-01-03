@echo off
call tsc
copy /y /b src\widget-ts\dist\widgets.css dist\css\widgets.css
copy /y /b src\widget-ts\dist\widgets.js dist\js\widgets.js
rmdir /s /q dist\js\widget-ts
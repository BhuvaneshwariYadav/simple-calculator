@echo off
setlocal
cd /d "%~dp0backend"
if not exist out mkdir out
javac -d out src\main\java\calculator\Calculator.java src\main\java\calculator\CalculatorServer.java
if errorlevel 1 exit /b 1
java -cp out calculator.CalculatorServer

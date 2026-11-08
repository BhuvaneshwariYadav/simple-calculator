# Simple Calculator

A lightweight calculator with a React + Vite frontend and a Java HTTP API.

## Requirements

- Java 17 or newer
- Node.js and npm

## Run it on Windows

1. In the project folder, double-click `run-backend.bat` (or run it from a terminal). The API starts at `http://localhost:8080`.
2. In a separate terminal, start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

3. Open the local URL printed by Vite, usually `http://localhost:5173`.

## Operations

Add, subtract, multiply, divide, and percent are supported. Percent calculates the first number as a percentage of the second; for example, `25 percent 80` returns `20`.

The API endpoint is `GET /api/calculate?operation=add&a=2&b=3`. Supported operation values are `add`, `subtract`, `multiply`, `divide`, and `percent`. Successful responses contain a numeric `result`; invalid requests, unsupported operations, and division by zero return an error message with HTTP 400.

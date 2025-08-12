# PMS_WEBAPI
A minimal .NET 8 Web API sample for Patients (in-memory).

## Requirements
- .NET 8 SDK installed

## Run locally
1. Restore & build:
```bash
dotnet restore
dotnet build
```

2. Run:
```bash
dotnet run
```

Swagger UI (Development): `https://localhost:5000/swagger`

## API Endpoints
- `GET /api/patients` - list sample patients
- `GET /api/patients/{id}` - get patient by id
- `POST /api/patients` - create patient (body -> Patient model)

## CORS
CORS policy allows `http://localhost:4200` for Angular dev server.

## Git
Initialize and push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit - PMS_WEBAPI"
git branch -M main
git remote add origin git@github.com:<you>/<repo>.git
git push -u origin main
```

## Tests
From the solution root run:
```bash
dotnet test
```

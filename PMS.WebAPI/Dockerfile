# Use official .NET SDK image for build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY *.csproj .
RUN dotnet restore

# Copy everything and build
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Expose port (Render auto-assigns $PORT)
EXPOSE 8080

# Tell ASP.NET Core to listen on 0.0.0.0 and $PORT
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "PMS.WebAPI.dll"]

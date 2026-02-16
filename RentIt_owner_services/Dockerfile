# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["RentIt_owner_services.csproj", "./"]
RUN dotnet restore "RentIt_owner_services.csproj"
COPY . .
RUN dotnet publish "RentIt_owner_services.csproj" -c Release -o /app/publish

# Serve Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_HTTP_PORTS=9092
EXPOSE 9092
ENTRYPOINT ["dotnet", "RentIt_owner_services.dll"]
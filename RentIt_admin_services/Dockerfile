# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["RentIt_admin_services.csproj", "./"]
RUN dotnet restore "RentIt_admin_services.csproj"
COPY . .
RUN dotnet publish "RentIt_admin_services.csproj" -c Release -o /app/publish

# Serve Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_HTTP_PORTS=9091
EXPOSE 9091
ENTRYPOINT ["dotnet", "RentIt_admin_services.dll"]

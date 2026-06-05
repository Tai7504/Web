# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["DrivingSchoolWeb.csproj", "./"]
RUN dotnet restore "DrivingSchoolWeb.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/"
RUN dotnet build "DrivingSchoolWeb.csproj" -c Release -o /app/build
RUN dotnet publish "DrivingSchoolWeb.csproj" -c Release -o /app/publish

# Stage 2: Serve
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "DrivingSchoolWeb.dll"]

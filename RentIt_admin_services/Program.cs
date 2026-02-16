using Microsoft.EntityFrameworkCore;
using RentIt_admin_services.Models;
using RentIt_admin_services.Repositories;
using RentIt_admin_services.Repositories.Interfaces;
using RentIt_admin_services.Servises;
using RentIt_admin_services.Servises.Interfaces;
using System.Text.Json.Serialization;
using Steeltoe.Discovery.Client;   // Enables .NET service registration with Eureka

namespace RentIt_admin_services
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Register service with Eureka Server
            builder.Services.AddDiscoveryClient(builder.Configuration);

            // CORS is handled by the API Gateway in the deployed/dev environment.
            // Remove local CORS policy to avoid duplicated Access-Control-Allow-Origin headers when gateway also sets CORS.

            // Add controller support
            builder.Services.AddControllers();

            // Enable Swagger (API documentation)
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                // Default app doc
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "RentIt_admin_services v1", Version = "v1" });
                // Admin-specific doc/group
                c.SwaggerDoc("admin", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "RentIt_admin_services - Admin", Version = "admin" });

                // Include admin controllers also in the v1 document so they're visible by default in the main selector
                c.DocInclusionPredicate((docName, apiDesc) =>
                {
                    if (docName == "admin")
                    {
                        return apiDesc.GroupName == "admin";
                    }

                    // for the default v1 doc include everything (including admin endpoints)
                    return true;
                });
            });


            // Prevent JSON cyclic reference errors and use camelCase property names
            builder.Services.AddControllers().AddJsonOptions(x =>
            {
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                x.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            });

            // Configure MySQL database connection
            builder.Services.AddDbContext<P20RentitContext>(options =>
            {
                options.UseMySql(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    ServerVersion.AutoDetect(
                        builder.Configuration.GetConnectionString("DefaultConnection")
                    )
                );
            });

            // Register Repository and Service (Dependency Injection)
            builder.Services.AddScoped<IAdminUserRepository, AdminUserRepository>();
            builder.Services.AddScoped<IAdminUserService, AdminUserService>();

            builder.Services.AddScoped<IAdminVehicleRepository, AdminVehicleRepository>();
            builder.Services.AddScoped<IAdminVehicleService, AdminVehicleService>();

            // Analytics repository
            builder.Services.AddScoped<IAdminAnalyticsRepository, AdminAnalyticsRepository>();
            builder.Services.AddScoped<IAdminAnalyticsService, AdminAnalyticsService>();

            // Vehicle Type repository and service
            builder.Services.AddScoped<IVehicleTypeRepository, VehicleTypeRepository>();
            builder.Services.AddScoped<IVehicleTypeService, VehicleTypeService>();

            // NOTE: Authentication/Authorization removed for standalone Admin service
            // Do not configure JWT/roles in this standalone mode per requirements.

            var app = builder.Build();

            // Enable Swagger only in development mode
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "RentIt_admin_services v1");
                    c.SwaggerEndpoint("/swagger/admin/swagger.json", "Admin APIs");
                });
            }

            // HTTPS disabled (Eureka works better with HTTP)
            // app.UseHttpsRedirection();

            // CORS is handled by the API Gateway; do not set CORS headers in the Admin service to avoid duplication.

            // Authentication & Authorization disabled in standalone mode (per requirements)

            // Map controller routes
            app.MapControllers();

            // Connect service to Eureka server
            app.UseDiscoveryClient();

            app.Run();
        }
    }
}

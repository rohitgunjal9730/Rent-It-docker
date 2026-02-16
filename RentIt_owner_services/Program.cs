using Microsoft.EntityFrameworkCore;
using RentIt_owner_services.Models;
using RentIt_owner_services.Repositories;
using RentIt_owner_services.Repositories.Interfaces;
using RentIt_owner_services.Services;
using RentIt_owner_services.Services.Interfaces;
using System.Text.Json.Serialization;
using Steeltoe.Discovery.Client;   // ✅ ADD THIS

namespace RentIt_owner_services
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ===============================
            // 🔥 Register Owner with Eureka
            // ===============================
            builder.Services.AddDiscoveryClient(builder.Configuration);

            // CORS Configuration
            //builder.Services.AddCors(options =>
            //{
            //    options.AddPolicy("AllowFrontend", policy =>
            //    {
            //        policy.WithOrigins("http://localhost:5173")
            //              .AllowAnyHeader()
            //              .AllowAnyMethod()
            //              .AllowCredentials();
            //    });
            //});

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Prevent cyclic JSON error
            builder.Services.AddControllers().AddJsonOptions(x => {
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                x.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            });

            // Database Configuration
            builder.Services.AddDbContext<P20RentitContext>(options =>
            {
                options.UseMySql(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    ServerVersion.AutoDetect(
                        builder.Configuration.GetConnectionString("DefaultConnection")
                    )
                );
            });

            // Repository + Service Registration
            builder.Services.AddScoped<IOwnerVehicleRepository, OwnerVehicleRepository>();
            builder.Services.AddScoped<IOwnerVehicleService, OwnerVehicleService>();

            builder.Services.AddScoped<IVehicleTypeRepository, VehicleTypeRepository>();
            builder.Services.AddScoped<IVehicleTypeService, VehicleTypeService>();

            builder.Services.AddScoped<IBrandRepository, BrandRepository>();
            builder.Services.AddScoped<IBrandService, BrandService>();

            builder.Services.AddScoped<IModelRepository, ModelRepository>();
            builder.Services.AddScoped<IModelService, ModelService>();

            builder.Services.AddScoped<IFuelTypeRepository, FuelTypeRepository>();
            builder.Services.AddScoped<IFuelTypeService, FuelTypeService>();

            builder.Services.AddScoped<IBookingService, BookingService>();
            builder.Services.AddScoped<IOwnerProfileService, OwnerProfileService>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Keep HTTPS disabled for Eureka
            // app.UseHttpsRedirection();

            app.UseCors("AllowFrontend");

            app.UseAuthorization();

            app.MapControllers();

            // ===============================
            // 🔥 Connect to Eureka
            // ===============================
            app.UseDiscoveryClient();

            app.Run();
        }
    }
}

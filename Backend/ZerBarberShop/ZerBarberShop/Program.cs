using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using ZerBarberShop.Data;

namespace ZerBarberShop
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Get the connection string
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            // Log the connection string securely
            var logger = builder.Services.BuildServiceProvider().GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Connection String loaded.");
            var currentDirectory = Directory.GetCurrentDirectory();
            logger.LogInformation("Current directory: " + currentDirectory);

            // Add DbContext
            builder.Services.AddDbContext<DataContext>(options =>
                    options.UseSqlite(connectionString)
                        .LogTo(Console.WriteLine, LogLevel.Information)
            );

            // Register IUserRepository and UserRepository with Scoped lifetime
            builder.Services.AddScoped<IUserRepository, UserRepository>();



            builder.Services.AddAuthorization();

            // Add Controllers
            builder.Services.AddControllers();

            // Add Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "ZerBarberShop API",
                    Version = "v1",
                    Description = "API documentation for ZerBarberShop",
                    Contact = new OpenApiContact
                    {
                        Name = "Kosrat Diaz",
                        Email = "Kosrat_95@hotmail.com"
                    }
                });
            });

            var app = builder.Build();

            // Enable Swagger
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "ZerBarberShop API V1");
                c.RoutePrefix = ""; // Loads Swagger at root (http://localhost:5000)
            });

            // Middleware order matters!
            app.UseAuthentication();  // Authentication before Routing
            app.UseAuthorization();   // Authorization before Routing
            app.UseRouting();         // Routing

            // Map Controllers
            app.MapControllers();

            app.Run();
        }
    }
}
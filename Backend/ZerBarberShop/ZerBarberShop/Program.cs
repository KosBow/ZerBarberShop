using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using ZerBarberShop.Data;

namespace ZerBarberShop
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add DbContext
            builder.Services.AddDbContext<DataContext>(options =>
                options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
            );

            // Add Identity
            builder.Services.AddIdentity<IdentityUser, IdentityRole>()
                .AddEntityFrameworkStores<DataContext>()
                .AddDefaultTokenProviders();

            // Add Authentication & Authorization
            builder.Services.AddAuthentication();
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
            app.UseRouting();
            app.UseAuthentication(); // ✅ Must be before UseAuthorization()
            app.UseAuthorization();

            // Map Controllers
            app.MapControllers();

            app.Run();
        }
    }
}
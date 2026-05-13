using InventoryAPI.Data;
using Microsoft.EntityFrameworkCore;

using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=inventory.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

QuestPDF.Settings.License = LicenseType.Community;

var app = builder.Build();

app.UseCors("AllowReact");

app.MapGet("/", () => "API veikia!");

app.MapControllers();

app.Run();
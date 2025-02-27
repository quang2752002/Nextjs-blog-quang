using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using React_blog_quangAPI.Data.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure database context
var connectionString = builder.Configuration.GetConnectionString("MyDB");
builder.Services.AddDbContext<BlogManagementContext>(options =>
    options.UseSqlServer(connectionString));

// Configure CORS
builder.Services.AddCors(c =>
{
    c.AddPolicy("AllowAllOrigins", options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// Configure JSON serialization settings
builder.Services.AddControllersWithViews().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
});

// Configure session state
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Set session timeout
});

// Register HttpContextAccessor
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Configure FormOptions to allow larger file uploads
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 104857600; // 100 MB
});

// Ensure the upload directory exists
var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
if (!Directory.Exists(uploads))
{
    Directory.CreateDirectory(uploads);
}

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowAllOrigins");
    app.UseSwagger(c => c.RouteTemplate = "/swagger/{documentName}/swagger.json");
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Vue v1"));
}

app.UseHttpsRedirection();
app.UseSession(); // Ensure this is called before UseRouting
app.UseRouting();
app.UseAuthorization();
app.MapControllers();

app.Run();

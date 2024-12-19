using Microsoft.Extensions.FileProviders;
using WebApi.Hubs;

var builder = WebApplication.CreateBuilder(args);

var allowLocalhostCors = "_allowLocalhostCors";

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: allowLocalhostCors,
        policy =>
        {
            // For allowing access when running `ng serve` or equivalent local frontend server while developing:
            policy.WithOrigins("http://localhost:4200", "https://localhost:4200");
            policy.AllowAnyHeader();
            policy.AllowCredentials();
        }
    );
});

builder.Services.AddHttpClient();

builder.Services.AddSignalR();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors(allowLocalhostCors);

string frontendBaseDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

// If using TypeScriptFrontend:
/*var fileServerOptions = new FileServerOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(frontendBaseDir, "ts_frontend")),
};*/

// If using Angular frontend:
var fileServerOptions = new FileServerOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(frontendBaseDir, "angular_frontend", "browser")
    ),
};

// If using raw JavaScript frontend:
// var fileServerOptions = new FileServerOptions
// {
//     FileProvider = new PhysicalFileProvider(Path.Combine(frontendBaseDir, "js_frontend")),
// };

app.UseFileServer(fileServerOptions);

// Use custom extension method to map all hubs.
app.MapHubs();

app.Run();

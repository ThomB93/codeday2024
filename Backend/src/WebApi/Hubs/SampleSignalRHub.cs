using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace WebApi.Hubs;

public class SampleSignalRHub : Hub
{
    public async Task SendMessage(MessageRequest request)
    {
        // Call "ReceiveMessage" on all connected clients.
        await Clients.All.SendAsync(
            "ReceiveMessage",
            new MessageResponse { User = request.User, Text = request.Text }
        );
    }

    public string HelloWorld()
    {
        return $"Hello world: {GetCurrentUserId()}";
    }

    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"{GetCurrentUserId()} Connected");
        await Task.CompletedTask;
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Task.CompletedTask;
    }

    public string? GetCurrentUserId()
    {
        // In the frontend examples, this is just a randomly generated uuid.
        // Possibly add real authentication if you have the time.
        // https://learn.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz?view=aspnetcore-9.0
        return Context.GetHttpContext()?.Request.Query["access_token"];
    }
}

public record MessageResponse
{
    [JsonPropertyName("user")]
    public required string User { get; init; }

    [JsonPropertyName("text")]
    public required string Text { get; init; }
}

public record MessageRequest
{
    [JsonPropertyName("user")]
    public required string User { get; init; }

    [JsonPropertyName("text")]
    public required string Text { get; init; }
}

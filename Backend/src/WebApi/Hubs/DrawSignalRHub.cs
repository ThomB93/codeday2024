using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace WebApi.Hubs;

public class DrawSignalRHub : Hub
{
    private const int NumberOfPlayersToStart = 2;
    private static List<string> ConnectedClients = [];
    private static string LobbyID = "";

    private readonly HttpClient _httpClient;

    public DrawSignalRHub(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
    
    public string HelloWorld()
    {
        return $"Hello world: {GetCurrentUserId()}";
    }

    public async Task SendDrawData(DrawRequest drawData)
    {
        // Broadcast the drawing data to all connected clients except the sender
        await Clients.Group(LobbyID).SendAsync("ReceiveDrawData", drawData);
    }

    public override async Task OnConnectedAsync()
    {
        //Console.WriteLine($"{GetCurrentUserId()} Connected");
        var userId = GetCurrentUserId();
        
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

    public async Task JoinLobby()
    {
        if (string.IsNullOrEmpty(LobbyID))
        {
            LobbyID = Guid.NewGuid().ToString();
        }

        if (!ConnectedClients.Contains(Context.ConnectionId))
        {
            ConnectedClients.Add(Context.ConnectionId);
        }

        await SendPlayerList();

        await Groups.AddToGroupAsync(Context.ConnectionId, LobbyID);

        await Clients.Group(LobbyID).SendAsync("PlayerJoinedLobby", Context.ConnectionId);

        // Tjekker om lobbyen er fuld (3 spillere)
        if (ConnectedClients.Count == 3)
        {
            await Clients.Group(LobbyID).SendAsync("LobbyFullAlert", $"Lobby with ID {LobbyID} is now full with 3 players... let the game begin!");

            var randomWord = await FetchRandomWord();
            if (!string.IsNullOrEmpty(randomWord))
            {
                await Clients.Group(LobbyID).SendAsync("ReceiveRandomWord", randomWord);
            }
        }
    }

    public async Task LeaveLobby()
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, LobbyID);

        Console.WriteLine($"User with ID {Context.ConnectionId} left lobby with ID {LobbyID}");
    }

    private async Task SendPlayerList()
    {
        await Clients.Group(LobbyID).SendAsync("ReceivePlayerList", ConnectedClients);
    }

    private async Task<string> FetchRandomWord()
    {
        const string defaultWord = "ost";

        try
        {
            var response = await _httpClient.GetAsync("https://random-word-form.herokuapp.com/random/noun");
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            var words = JsonSerializer.Deserialize<List<string>>(responseBody);

            return words?.FirstOrDefault() ?? defaultWord;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching random word: {ex.Message}");
            return defaultWord;
        }
    }
}

public record DrawRequest
{
    public int StartX { get; set; }
    public int StartY { get; set; }
    public int X { get; set; }
    public int Y { get; set; }
    public string Color { get; set; } = "black"; 
    public int Thickness { get; set; } = 1; 
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

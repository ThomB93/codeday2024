namespace WebApi.Hubs;

public static class HubMapper
{
    public static void MapHubs(this IEndpointRouteBuilder app)
    {
        app.MapHub<DrawSignalRHub>("/draw");
    }
}

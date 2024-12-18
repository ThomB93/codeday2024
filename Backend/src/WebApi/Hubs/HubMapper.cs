namespace WebApi.Hubs;

public static class HubMapper
{
    public static void MapHubs(this IEndpointRouteBuilder app)
    {
        app.MapHub<SampleSignalRHub>("/sample");
        // app.MapHub<OtherSignalRHub>("/otherHub");
    }
}

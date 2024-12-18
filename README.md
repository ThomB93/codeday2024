# Code Day 2024

## Indholdsfortegnelse

- [Prerequisites](#prerequisites)
- [Teknologi](#teknologi)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Noter](#noter)
  - [Resourcer](#resourcer)
- [Opgave](#opgave)
  - [Opgave A: Tegn og gæt (mest backend)](#opgave-a-tegn-og-gæt-mest-backend)
  - [Opgave B: Sænke slagskibe (mest frontend)](#opgave-b-sænke-slagskibe-mest-frontend)
- [Deploy til Azure App Service](#deploy-til-azure-app-service)
  - [Forberedelse](#forberedelse)
  - [Med Visual Studio](#i-visual-studio)
  - [Med VS Code](#i-visual-studio-code)
  - [Med Git](#andre)

## Prerequisites

- [.NET 9 er installeret](https://learn.microsoft.com/en-us/dotnet/core/install/windows).
  - Visual Studio: Inkluderet i version >=17.12.
  - VS Code: Se ovenstående link
  - Jetbrains Rider: Skal være version >= 2024.3 (måske skal .NET 9 installeres manuelt).
- [Node.js](https://nodejs.org/en) (^18.19.1 || ^20.11.1 || ^22.0.0 hvis du vil lave frontend i Angular).
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli#install-or-update) (hvis du skal deploye med Git, f.eks. hvis du ikke bruger Visual Studio (Code)).
- [Azure Tools (VS Code extension)](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) (hvis du skal deploye med VS Code).

## Teknologi

### Frontend

Frontenden skal bruge en SignalR klient til at kommunikere med backenden. Der er eksempler på dette i repoet.

#### Valg af frontend

1. Rå TS/HTML/CSS

   - Stå i `Frontend/TypeScriptFrontend` og kør `npm ci`.
   - Brug den `fileServerOptions` i `Backend/src/WebApi/Program.cs` med stien til `wwwroot/ts_frontend` og udkommenter den anden (default).
   - I `Frontend/TypeScriptFrontend/src` ligger `index.ts` og `index.html` som er entrypoints. I `ts` mappen ligger `game.ts` og `signal-r-client.ts`, der lige nu bruges af `index.ts`.
   - Når du kører `npm run build`, mens du står i `Frontend/TypeScriptFrontend`, placeres JS, HTML og CSS i `Backend/src/WebApi/wwwroot/ts_frontend` som serves når du starter backenden (`https` launch profile). Kommandoen bruger `webpack --watch`, så ændringer bliver reflekteret uden at man skal bygge igen.

2. Angular

   - Stå i `Frontend/AngularFrontend` og kør `npm ci`.
   - Brug den `fileServerOptions` i `Backend/src/WebApi/Program.cs` med stien til `wwwroot/angular_frontend` og udkommenter den anden.
   - Under udvikling kan man starte frontenden ved at køre `ng serve` mens man står i `Frontend/AngularFrontend` og åbne `http://localhost:4200`. Husk også at starte backenden (`https` launch profile).
   - Når der skal deployes, skal man køre `ng build`, hvilket lægger filerne i `Backend/src/WebApi/wwwroot/angular_frontend/browser`. Herefter kan ASP.NET Core appen udgives.

3. Andet

   - Sørg for at HTML/JS/CSS blivier placeret et sted i `Backend/src/WebApi/wwwroot` og at `fileServerOptions` i `Program.cs` matcher stien til `index.html`. Der er også et JavaScript eksempel i `Backend/src/WebApi/wwwroot/js_frontend`.

### Backend

- Backenden er en ASP.NET Core app og bruge SignalR. Der et eksempel på en SignalR hub i `Backend/src/WebApi/Hubs/SampleSignalRHub.cs`.
- Hvis du **ikke** skal deploye med Git (med med Visual Studio, VS Code, zip deploy el. lign hvor der bygges lokalt), kan du opgradere til .NET 9 og C# 13 ved at slette `Backend/global.json`, slette hele `<PropertyGroup></PropertyGroup>` fra `Backend/src/WebApi/WebApi.csproj` og ændre `Backend/Directory.Build.props` til .NET 9 og C# 13.
  - Grunden til at jeg har sat det til .NET 8/C# 12 er, at MSBuild på Azure serveren er for gammel til at kunne bygge .NET 9.

### Noter

- Den eksisterende kode er udelukkende et oplæg. I kan vælge at fortsætte med den eksisterende struktur, eller lave helt om på filerne og koden. De er der blot for at vise eksempler på henholdsvis at tegne på et canvas og hvordan SignalR virker.
- Hvis det bliver nødvendigt at kigge på netværkstrafikken mellem frontend og backend, er det nemmest at aktivere `WS` (WebSocket) filtret i netværksmonitoren i browseren og vælge den entry med navnet på hubben (f.eks. "sample" som i eksempelkoden). Herefter vil sendte og modtagne beskeder vises under "Messages" (i Chrome).

### Resourcer

#### Frontend

- [MDN Web Docs - CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).
- [MDN Web Docs - Path2D](https://developer.mozilla.org/en-US/docs/Web/API/Path2D).

#### Backend

- [Microsoft Learn - Overview of ASP.NET Core SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-9.0).
- [Microsoft Learn - Tutorial: Get started with ASP.NET Core SignalR [JavaScript]](https://learn.microsoft.com/en-us/aspnet/core/tutorials/signalr?view=aspnetcore-9.0).
- [Microsoft Learn - Tutorial: Get started with ASP.NET Core SignalR [TypeScript]](https://learn.microsoft.com/en-us/aspnet/core/tutorials/signalr-typescript-webpack?view=aspnetcore-9.0).
- [Microsoft Learn - Dependency injection i hubs](https://learn.microsoft.com/en-us/aspnet/core/signalr/hubs?view=aspnetcore-9.0#inject-services-into-a-hub).

## Opgave

- Vælg en af de to opgaver.
- Jeg har forsøgt at dele funktionerne op i to kategorier; påkrævede og valgfri. De påkrævedede laves som udgangspunkt først, og når de er løst, burde det være muligt at teste spillet i en eller anden form.
- De påkrævede er opstillet i den rækkefølge, jeg tænker, det vil være mest naturligt at lave dem, men det står folk frit for. Nogle afhænger f.eks. af tidligere funktioner. Nogle af funktionerne hænger også meget sammen med andre, så kig lige på, om du kan lave flere på en gang, når du starter på en ny.
- De valgfri funktioner et mit bud på de mest åbenlyse forbedringer, der kan laves. Man kan vælge at lave disse og eller finde på sine egne forbedringer.
- Nogle funktioner (både påkrævede og valgfri) kræver udvikling i både frontend og backend, mens andre kun kræver én af delene.

### Opgave A: Tegn og gæt (mest backend)

I denne opgave vil du skulle lave lidt mere arbejde i backenden end i frontenden.

#### Påkrævede funktioner

1. Gør det muligt at tegne med musen på canvas'et med én farve i én størrelse (hardcodede værdier).
   - For nu behøver det ikke at være muligt at fortsætte med at tegne, hvis musen forlader canvas'et og kommer tilbage.
   - Hints:
     - canvas.addEventListener("mousedown"|"mouseup"|"mousemove").
     - `context.lineCap` og `lineJoin` kan med fordel ændres til `round` for pænere linjer.
     - Del funktionaliteten op, så man kan genbruge f.eks. tegnekoden til at tegne andre spilleres streger og kan sende de tegnede streger til backenden.
2. Lav "clear" funktionalitet til canvas'et der sletter alt det tegnede. Funktionen tages ikke i brug endnu.
3. Send det der tegnes på canvas'et til alle andre connections med SignalR.
4. Modtag andre spilleres tegning og vis det på canvas'et.
   - Åben et nyt browservindue for at teste. Alle åbne tabs bør nu kunne sende og modtage tegninger.
5. Lav en "lobby" (med en form for unikt id) når første spiller joiner. Dette skal gemmes et sted (hukommelse, database, fil, el. lign.).
   - Gør det muligt at tilslutte en eksisterende lobby.
   - Når x antal spillere (mindst én mere) har joinet skal spillet starte. Kan hardcodes til f.eks. 2 nu.
   - Hints:
     - Brug evt. url route/query parameter til at gemme lobby id (ingen lobby id?: ny lobby, lobby id sat?: tilslut eksisterende), så andre kan tilslutte en lobby med en specifik url.
     - Det vil give rigtige god mening at kigge på [SignalR groups](https://learn.microsoft.com/en-us/aspnet/core/signalr/groups?view=aspnetcore-9.0).
     - Se evt. på [singleton services](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-9.0).
6. Gør så tegninger kun sendes til de spillere, der er i den lobby (evt. SignalR gruppe), som brugeren er i.
7. Implementer ture og runder:
   - Lås for tegning på canvas, medmindre det er spillerens tur.
   - Ignorer tegningen fra SignalR serveren i den tegnende spillers browser (eller lav noget logik på serveren, så det ikke sendes til den spiller).
   - Giv turen videre til næste spiller efter en timeout.
     - Hint: Hvis dette implementeres i backenden, kan man evt. kigge på [singleton services](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-9.0) eller [BackgroundService](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-9.0&tabs=visual-studio).
   - Clear alle spilleres canvas når en tur starter og slutter.
   - Når alle spillere har tegnet er runden slut. Start næste runde, hvis antal runder < max antal runder (hardcode), ellers stop spillet.
8. Implementer autogenerering af ord når en tur starter. Ordet sendes kun til den bruger hvis tur det er til at tegne.
9. Implementer gætte-funktionalitet.
   - De spillere, som ikke tegner, får vist et input felt og en send knap.
   - Hvis alle spillere har gættet rigtigt gives turen videre til næste spiller med det samme (vent ikke på timeout).
   - Giv point til hver spiller (også tegneren) kriterier, som du bestemmer.
10. Efter sidste runde vises alle spilleres point.

#### Valgfri funktioner

- Find selv på andet. Denne står øverst, da jeg gerne vil opfordre til, at vi får så forskellige løsninger, som muligt.
- Implementer viskelæder.
- Gør første spiller der tilslutter sig en ny lobby til "lobby admin". Lav en knap som "admin" spilleren kan bruge til at starte spillet.
- Giv spilleren flere farver (f.eks. 4) at tegne med. Måske kan det skifte fra tur til tur.
- Gør det muligt for spilleren at indtaste sit navn inden spillet starter og brug dette til at vise, hvem der tegner og hvem der har fået, de forskellige antal point.
- Luk for adgang til lobbyen for nye spillere, når spillet er startet.
- Implementer caching af nuværende tegners tegning, så spillere der mister forbindelsen kan komme "up to speed".
- Lad admin sætte indstillinger for spillet. F.eks. antal runder, definere ordliste, hvor meget man må bruge viskelæderet, hvor mange (eller hvilke) farver der kan bruges og lign.
- Lav rigtig login og brug [`[Authorize]`](https://learn.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz?view=aspnetcore-9.0) attributten.

### Opgave B: Sænke slagskibe (mest frontend)

I denne opgave vil du skulle lave lidt mere arbejde i frontenden end i backenden.

#### Påkrævede funktioner

1. Lav et grid. Du vælger selv hvordan det teknisk skal laves.
   - Standard størrelse er 10x10.
2. Gør det muligt at placere skibe på grid'et. Hold det gerne simpelt for nu og vend evt. tilbage.
   - Standard skibsstørrelser er: 1x5, 1x4, 2x3, 2x2.
3. Lav en "lobby" (med en form for unikt id) når første spiller joiner. Dette skal gemmes et sted (hukommelse, database, fil, el. lign.).
   - Gør det muligt at tilslutte en eksisterende lobby.
   - Når der er to spillere, lukkes adgangen til lobbyen.
   - Hints:
     - Brug evt. url route/query parameter til at gemme lobby id (ingen lobby id?: ny lobby, lobby id sat?: tilslut eksisterende), så andre kan tilslutte en lobby med en specifik url.
     - Det vil give rigtige god mening at kigge på [SignalR groups](https://learn.microsoft.com/en-us/aspnet/core/signalr/groups?view=aspnetcore-9.0).
     - Se evt. på [singleton services](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-9.0).
4. Gør det muligt at sende ens konfiguration af skibe til backenden.
5. Når begge spillere har sendt deres konfiguration vises et nyt (i starten tomt) grid for den spiller, som starter med at skyde.
   - Dette grid skal vise tidligere skud, og om det er hit eller miss. Hænger sammen med de næste opgaver.
6. Gør det muligt for den skydende spiller at trykke på et felt for at skyde og sende det til backenden.
   - Indiker om det var hit eller miss på begge spilleres grids.
   - Lav en speciel indikation på den skydende spillers grid, hvis et helt skib er sænket (alle felter som skibet dækker er ramt).
7. Implementer ture:
   - Byt om på visning af grids, så den spiller der før skød, nu ser sine egne skibe, og hvor der er skudt og omvendt, så den skydende spiller kun ser sine tidligere skud, og selvfølgelig ikke modstanderens skibe.
8. Når den ene spillers sidste skib er sænket annonceres slutter spillet og vinderen annonceres.

#### Valgfri funktioner

- Find selv på andet. Denne står øverst, da jeg gerne vil opfordre til, at vi får så forskellige løsninger, som muligt.
- Implementer n-player mode.
  - Måske skal man skyde på alle sine modstanderen, når det er ens tur for at gøre det mest fair?
  - Skal spilleres skud på en modstander vises for alle eller er det kun de to involverede, som skal kunne se det?
- Implementer "salvemode":
  - Den skydende spiller vælger (først) 5 felter som ved tryk på en knap alle sendes til backenden og markeres som hit eller miss på begge spilleres grids.
  - For hvert af den skydende spillers skibe der er sænket fratages ét skud fra salven.
    - Eks.: Hvis den skydende spiller har mistet 2 skibe, har spilleren kun 3 skud.
- Indiker hvilken slags skib, der er ramt på det grid, den skydende spiller ser.
- Gør første spiller der tilslutter sig en ny lobby til "lobby admin". Lav en knap som "admin" spilleren kan bruge til at starte spillet.
- Gør det muligt for spilleren at indtaste sit navn inden spillet starter og brug dette til at vise, hvem der tegner og hvem der har fået, de forskellige antal point.
  - Hvis aktuelt: Giv lobby admin mulighed for at ændre mode.
  - Hvis aktuelt: Giv lobby admin mulighed for at ændre om det vises, hvilken type skib, der er ramt.
- Lav rigtig login og brug [`[Authorize]`](https://learn.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz?view=aspnetcore-9.0) attributten.

## Deploy til Azure App Service

### Forberedelse

#### Første gang

1. Gå til [Resource groups [Azure Portal]](https://portal.azure.com/#browse/resourcegroups) og lav en ny resource group i "North Europe". Navngiv "RNE-CodeDay2024-ResourceGroup" (skift prefix til dine initialer).
   - Tryk på "Review + create" > "Create".
2. Gå til [Create App Service Plan [Azure Portal]](https://portal.azure.com/#create/Microsoft.AppServicePlanCreate).
   - Vælg den nye resource group.
   - Navngiv "RNE-CodeDay2024-Plan" (skift prefix til dine initialer).
   - Vælg Windows.
   - Vælg "North Europe".
   - Tryk på "Explore pricing plans" og vælg B2.
   - Tryk på "Review + create" > "Create".

#### Ved opdatering

1. Hvis aktuelt: Byg frontend med `npm run build` (og sørg for at backenden er konfigureret med den rigtige `fileServerOptions`).
2. Hvis Git deploy: Merge ændringer ind i `production` branchen.

### Med Visual Studio

1. Højreklik på `WebApi` projektet og tryk `Publish`.
2. Tryk "New profile".
3. Vælg Azure.
4. Vælg Azure App Service (Windows).
5. Verificer at du er logget ind med den konto, din Azure subscription er tilknyttet.
6. Vælg den rigtige subscription (den der er tilknyttet til din Visual Studio subscription eller en anden personlig subscription).
7. Tryk "Create new".
8. Skriv et nyt navn der starter dine initialer efterfulgt af bindestreg. F.eks. "RNE-CodeDay2024"
9. Vælg den rigtige subscription og den nye resource group og hosting plan.
10. Tryk på "Create".
11. Tryk på "Finish".
12. Tryk på "Publish".
13. Åben den nye side i browseren.

### Med VS Code

1. Stå i `Backend` mappen i terminalen og kør `dotnet publish --configuration Release`
2. Åben `Azure Tools` extension'en og login med den bruger, som din Azure subscription er tilknyttet.
3. Fold den korrekte subscription ud og højreklik på "App Service" og vælg "Create New Web App... (Advanced)".
4. Navngiv app og vælg den resource group som du har lavet.
5. Vælg .NET 9 (husk at skifte til .NET 9 som beskrevet i starten af denne README).
6. Vælg Windows.
7. Vælg den app service plan du har lavet.
8. Vælg "Skip for now" (Application Insights).
9. Højreklik på den nye app service i `Azure` extension'en og vælg "Deploy to Web App...".
10. Vælg "Browse" og vælg `.../Backend/src/WebApi/bin/Release/net9.0/publish.
11. Tryk på "Deploy".
12. Tryk på "Yes" til "Always deploy the...".
13. Åben den nye side i browseren.

### Git

1. Kør `az login` for at logge ind med den bruger, din Azure subscription er tilknyttet og vælg den rigtige subscription.
2. Lav en deployment user med `az webapp deployment user set --user-name <username> --password <password>` (brugernavn skal være unikt og koden skal være god (og selvfølgelig ikke brugt før)).
3. Kør følgende i terminalen (navngiv web app som i Visual Studio guiden):

   ```
   az webapp create --resource-group <group-name> --plan <app-service-plan-name> --name <app-name> --runtime "dotnet:8" --deployment-local-git
   ```

   - Gem den url fra outputtet der står efter "Local git is configured with url of "

4. Kør `git remote add azure <url>` med url'en fra sidste trin mens du står i rodmappen af repo'et.
5. Kør `az webapp config appsettings set --name <app-name> --resource-group <group-name> --settings DEPLOYMENT_BRANCH='production'`
6. Kør `git push azure production`.

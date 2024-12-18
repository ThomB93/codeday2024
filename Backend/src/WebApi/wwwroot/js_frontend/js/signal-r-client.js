const userId = crypto.randomUUID();

// This is just an example that shows how to connect to a SignalR hub named "sample".
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/sample", { accessTokenFactory: () => userId })
    .withAutomaticReconnect()
    .build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", dto => {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you
    // should be aware of possible script injection concerns.
    li.textContent = `${dto.user} says ${dto.text}`;
});

connection.start().then(() => {
    document.getElementById("sendButton").disabled = false;
    return connection.invoke("HelloWorld");
}).then(res => {
    console.log(`Hello World response: ${res}`);
}).catch(err => {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", event => {
    const user = document.getElementById("userInput").value;
    const message = document.getElementById("messageInput").value;
    const dto = { user, text: message };

    connection.invoke("SendMessage", dto).catch(err => {
        return console.error(err.toString());
    });

    event.preventDefault();
});
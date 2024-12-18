const canvas = document.getElementById("canvas");
context: CanvasRenderingContext2D;

canvas.width = 1024;
canvas.height = 576;
const context = canvas.getContext("2d");


drawSomething();

function drawSomething()
{
    context.lineWidth = 10;
    context.strokeStyle = "blue";

    const rectSize = 100;
    const p1 = {x: 512 - rectSize / 2, y: 288 - rectSize / 2};
    const p2 = {x: 512 + rectSize / 2, y: 288 - rectSize / 2};
    const p3 = {x: 512 + rectSize / 2, y: 288 + rectSize / 2};
    const p4 = {x: 512 - rectSize / 2, y: 288 + rectSize / 2};

    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.stroke();

    context.beginPath();
    context.lineWidth = 10; // Has to come after beginPath() and before stroke()
    context.moveTo(p2.x, p2.y);
    context.lineTo(p3.x, p3.y);
    context.strokeStyle = "green"; // Has to come after beginPath() and before stroke()
    context.stroke();

    context.beginPath();
    context.moveTo(p3.x, p3.y);
    context.lineTo(p4.x, p4.y);
    context.lineTo(p1.x, p1.y); // Multiple lines in a path will be connected
    context.strokeStyle = "red";
    context.stroke();
}

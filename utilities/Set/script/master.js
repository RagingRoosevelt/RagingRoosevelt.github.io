/**
 * Created by Theodore on 2/25/2017.
 */

const cRed = "#ff0000";
const cPurple = "#8800ff";
const cGreen = "#00ff00";
const cBlack = "#000000";
const fEmpty = "empty";
const fPartial = "partial";
const fSolid = "solid";
const sDiamond = "diamond";
const sWave = "wave";
const sOval = "oval";
const pi = Math.PI;
const lineCount = 33;

let board = {w: 4,
            h: 3,
            cards: [],
            deck: [],
            picked: []};
let card = {ar: 1.56,
            w: 100,
            pad: function(){
                return 0.1 * this.w
            },
            h: function(){
                return this.ar*this.w
            },
            shading: function(){
                let c = Math.ceil(this.w/6);
                return (c%2==1) ? c : c-1;
            }};

window.onload = init;

function init() {
    for (let color of [cRed, cGreen, cPurple]) {
        for (let shape of [sDiamond, sWave, sOval]) {
            for (let fill of [fEmpty, fPartial, fSolid]) {
                for (let count of [1, 2, 3]) {
                    //console.log(count + " " + color + " " + fill + " " + shape);
                    board.deck.push({color: color, shape: shape, fill: fill, count: count});
                }
            }
        }
    }
    shuffle(board.deck);

    resizedWindow();
    drawBoard();
}

function resizedWindow() {
    let h = $("body").height();
    let w = $("body").width();
    if (h > card.ar * w) {
        board.h = 4;
        board.w = 3;
        //card.w = (h / 5)/card.ar;
    } else {
        board.h = 3;
        board.w = 4;
        //card.w = (h / 5)/card.ar;
    }

    console.log(h / board.h);
    console.log(w / board.w);
    card.w = 0.75 * Math.min(h / (board.h * card.ar), w / board.w);

    drawBoard();
}

function drawBoard() {
    let canvas = $("#board").get(0);
    let ctx = canvas.getContext("2d");
    w = Math.round($("#div_board").width());
    h = Math.round($("#div_board").height());
    ctx.canvas.height = h;
    ctx.canvas.width = w;

    const margin = 10;
    const thickness = 2;
    const shapeH = 100;
    const shapeW = 2*shapeH;

    refillBoard();

    cw = card.w;
    ch = card.h();
    padding = card.pad();

    x0 = padding;
    y0 = padding;

    for (let row=0; row<board.h; row++) {
        for (let col=0; col<board.w; col++) {
            x = x0+cw*col+padding*col;
            y = y0+ch*row+padding*row;
            drawCard(ctx, x,y, x+cw, y+ch, 3, board.cards[row*board.w+col]);
        }
    }
}

function refillBoard() {
    while (board.cards.length < 12) {
        board.cards.push(board.deck.pop());
        console.log("Board now has " + board.cards.length + " cards");
    }
}

function drawCard(ctx,x1,y1,x2,y2,thickness,info) {
    const w = x2-x1;
    const h = y2-y1;
    xm = (x1+x2)/2;
    ym = (y1+y2)/2;

    drawRectangleRounded(ctx,x1,y1,x2,y2,h/10,thickness);

    let shape;
    if (info.shape == sOval) {
        shape = drawOval;
    } else if (info.shape == sWave) {
        shape = drawWave;
    } else if (info.shape == sDiamond) {
        shape = drawDiamond;
    }

    let locations = [ym];
    if (info.count == 2) {
        locations = [ym-h/6, ym+h/6];
    } else if (info.count == 3) {
        locations = [ym-7*h/24, ym, ym+7*h/24];
    }

    for (y of locations) {
        shape(ctx, xm, y, 2*w/3, 2*w/6, thickness, info.fill, info.color);
    }
}

function drawRectangleRounded(ctx, x1, y1, x2, y2, rad, thickness) {
    ctx.beginPath();
    ctx.strokeStyle = cBlack;
    ctx.moveTo(x1+rad, y1);
    ctx.lineTo(x2-rad, y1);
    ctx.quadraticCurveTo(x2,y1,x2,y1+rad);
    ctx.lineTo(x2,y2-rad);
    ctx.quadraticCurveTo(x2,y2,x2-rad,y2);
    ctx.lineTo(x1+rad, y2);
    ctx.quadraticCurveTo(x1,y2,x1,y2-rad);
    ctx.lineTo(x1,y1+rad);
    ctx.quadraticCurveTo(x1,y1,x1+rad,y1);
    ctx.closePath();
    ctx.lineWidth = thickness;
    ctx.stroke();

}

function drawDiamond(ctx,x,y,w,h,thickness,fill,color) {
    h = h/2;
    w = w/2;
    const lineCount = card.shading();

    ctx.beginPath();
    ctx.moveTo(x,y-h);
    ctx.lineTo(x+w,y);
    ctx.lineTo(x,y+h);
    ctx.lineTo(x-w,y);
    ctx.lineTo(x,y-h);

    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.outlineStyle = color;
    ctx.fillStyle = color;

    if (fill==fEmpty) {
        ctx.stroke();
    } else if (fill==fPartial) {
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = (thickness > 1) ? Math.floor(thickness/3) : 1;

        function topleft(x,x1,y1,w,h) {
            return -(h*x)/w + h*(x1/w - 1) + y1;
        }
        function topright(x,x1,y1,w,h) {
            return  (h*x)/w - (h*(w + x1))/w + y1;
        }
        function bottomright(x,x1,y1,w,h) {
            return  -(h*x)/w + (h*x1)/w + h + y1;
        }
        function bottomleft(x,x1,y1,w,h) {
            return (h*x)/w - (h*x1)/w + h + y1 ;
        }

        const dX = 2*w/(lineCount-1);
        for (let i=x-w+dX; i<x; i+=dX) {
            ctx.moveTo(i,bottomleft(i,x,y,w,h));
            ctx.lineTo(i,topleft(i,x,y,w,h));
        }
        for (let i=x+dX; i<x+w; i+=dX) {
            ctx.moveTo(i,topright(i,x,y,w,h));
            ctx.lineTo(i,bottomright(i,x,y,w,h));
        }
        ctx.moveTo(x,y-h);
        ctx.lineTo(x,y+h);

        ctx.stroke();
    } else if (fill==fSolid) {
        ctx.closePath();
        ctx.fill();
    }
}

function drawOval(ctx,x,y,w,h,thickness,fill,color) {
    w = w/2;
    h = h/2;
    const lineCount = card.shading();

    ctx.beginPath();
    ctx.moveTo(x-w+h,y-h);
    ctx.lineTo(x+w-h,y-h);
    ctx.arcTo(x+w,y-h,x+w,y,h);
    ctx.arcTo(x+w,y+h,x+w-h,y+h,h);
    ctx.lineTo(x-w+h,y+h);
    ctx.arcTo(x-w,y+h,x-w,y,h);
    ctx.arcTo(x-w,y-h,x-w+h,y-h,h);

    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.outlineStyle = color;
    ctx.fillStyle = color;

    if (fill==fEmpty) {
        ctx.stroke();
    } else if (fill==fPartial) {
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = (thickness > 1) ? Math.floor(thickness/3) : 1;

        const dX = 2*w/(lineCount-1);

        for (let i=x-w+dX; i<x+w; i+=dX) {
            ctx.moveTo(i,y-h);
            ctx.lineTo(i,y+h);
        }
        ctx.stroke();

    } else if (fill==fSolid) {
        ctx.closePath();
        ctx.fill();
    }
}

function drawWave(ctx,x,y,w,h,thickness,fill,color) {
    w = w / 2;
    h = h / 2;
    const lineCount = card.shading();

    ctx.font = h + "px Arial";
    ctx.fillStyle = color;
    ctx.fillText(fill + "\nwave", x-1.3*w, y);

}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
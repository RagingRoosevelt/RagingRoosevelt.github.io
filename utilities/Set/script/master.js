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
let canvas;
let ctx;
let boardDiv;

let active = "board";
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
            },
            posX: function(x0) {
                let v = [];
                for (let col=0; col<board.w; col++) {
                    v.push(x0+this.w*col+this.pad()*(col+1));
                }
                return v;
            },
            posY: function(y0) {
                let v = [];
                for (let row=0; row<board.h; row++) {
                    v.push(y0+this.h()*row+this.pad()*(row+1));
                }
                return v;
            },
            rowcol2i: function(row, col) {
                return row*board.w+col;
            }
            };

window.onload = init;

/** Function sets up the deck.
 *  Then calls functions to set up and draw the board.
 */
function init() {
    canvas = $("#board").get(0);
    ctx = canvas.getContext("2d");
    boardDiv = $("#div_game");

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

    refillBoard();

    resizedWindow();
    drawBoard();

    //canvas.onclick = clickedBoard;
}

/** Function determines appropriate sizes for the canvas and cards in order to fit the window.
 *  Then calls a function to redraw the board.
 */
function resizedWindow() {
    let h = boardDiv.height();
    let w = boardDiv.width();

    ctx.canvas.height = h;
    ctx.canvas.width = w;

    if (h > card.ar * w) {
        board.h = 4;
        board.w = 3;
        //card.w = (h / 5)/card.ar;
    } else {
        board.h = 3;
        board.w = 4;
        //card.w = (h / 5)/card.ar;
    }

    card.w = 0.75 * Math.min(h / (board.h * card.ar), w / board.w);



    drawBoard();
}

/** Function draws the board.
 *  If more than 12 spaces are needed, it fills in extra rows or cols as orientation allows.
 */
function drawBoard() {
    w = Math.round(boardDiv.width());
    h = Math.round(boardDiv.height());

    const margin = 10;
    const thickness = 2;
    const shapeH = 100;
    const shapeW = 2*shapeH;

    let cw = Math.round(card.w);
    let ch = Math.round(card.h());
    let pad = Math.round(card.pad());

    let posX = card.posX(0);
    let posY = card.posY(0);

    $(".card").remove();

    console.log(posX, board.h, posY, board.w);

    for (let row=0; row<board.h; row++) {
        for (let col=0; col<board.w; col++) {
            let x = Math.round(posX[col]);
            let y = Math.round(posY[row]);
            let i = card.rowcol2i(row,col);
            drawCard(ctx, x,y, x+cw, y+ch, 3, board.cards[i]);

            $("#div_game").append($(buildDiv(x,y,cw,ch,i)));
        }
    }

    log("A set is " + (isSetAvailable() ? "" : "not ") + "available");
}

function refillBoard() {
    while (board.cards.length < 12) {
        board.cards.push(board.deck.pop());
        console.log("Board now has " + board.cards.length + " cards");
    }
}

function drawCard(ctx,x1,y1,x2,y2,thickness,info) {
    console.log("drawing card at (" + x1 + ", " + y1 + ")");
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

    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.outlineStyle = color;
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(x-w+h,y-h);
    ctx.lineTo(x+w-h,y-h);
    ctx.arcTo(x+w,y-h,x+w,y,h);
    ctx.arcTo(x+w,y+h,x+w-h,y+h,h);
    ctx.lineTo(x-w+h,y+h);
    ctx.arcTo(x-w,y+h,x-w,y,h);
    ctx.arcTo(x-w,y-h,x-w+h,y-h,h);

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

    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.outlineStyle = color;
    ctx.fillStyle = color;

    ctx.beginPath();

    // set up basic shape
    let points = [{x: -4, y: 0}
        , {x: 0, y: -4}
        , {x: 1, y: -2}
        , {x: 3, y: -2}
        , {x: 4, y: 0}
        , {x: 0, y: 4}
        , {x: -1, y: 2}
        , {x: -3, y: 2}
        , {x: -4, y: 0}];
    let control = [{x: -3, y: -4}
        , {x: 1, y: -4}
        , {x: 1.5, y: 0}
        , {x: 4, y: -2}
        , {x: 3, y: 4}
        , {x: -1, y: 4}
        , {x: -1.5, y: 0}
        , {x: -4, y: 2}];
    ctx.moveTo(x+points[0].x*w/4, y+points[0].y*h/4);
    for (let i=1; i<points.length; i++) {
        ctx.quadraticCurveTo(x+control[i-1].x*w/4, y+control[i-1].y*h/4, x+points[i].x*w/4, y+points[i].y*h/4);
    }

    // draw the shape's fill
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

function isSet(hand) {
    let c1 = hand[0];
    let c2 = hand[1];
    let c3 = hand[2];

    let v = true;

    if (!(c1.color == c2.color && c2.color == c3.color)
        && !(c1.color != c2.color && c1.color != c3.color && c2.color != c3.color)) {
        v = false;
    } else if (!(c1.shape == c2.shape && c2.shape == c3.shape) &&
        !(c1.shape != c2.shape && c1.shape != c3.shape && c2.shape != c3.shape)) {
        v = false;
    } else if (!(c1.fill == c2.fill && c2.fill == c3.fill) &&
        !(c1.fill != c2.fill && c1.fill != c3.fill && c2.fill != c3.fill)) {
        v = false;
    } else if (!(c1.count == c2.count && c2.count == c3.count) &&
        !(c1.count != c2.count && c1.count != c3.count && c2.count != c3.count)) {
        v = false;
    }

    return v;
}

function isSetAvailable() {
    let comb = k_combinations(board.cards, 3);


    for (hand of comb) {
        if (isSet(hand)) {
            return true;
        }
    }
    return false;
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

function buildDiv(x,y,w,h,i) {
    let r = "<div class=card id=card"+i+" style=\"";
    r += "height: "+h+"px; ";
    r += "width: "+w+"px; ";
    r += "left: "+x+"px; ";
    r += "top: "+y+"px; ";
    r += "border-radius: "+h/10+"px; "
    r += "\" onclick=javascript:clickedCard("+i+")";
    r += "></div>";
    return r;
}

function clickedCard(i) {
    //log("Selected card #" + i);

    // has the card already been picked?  if so, remove it
    for (j in board.picked) {
        if (i == board.picked[j].i) {
            //log("Deselected card #" + i);
            let temp = board.picked.splice(j,1);
            setCardHighlight(temp[0].i, false);
            return;
        }
    }

    // are there already three cards picked?  if so, removed the first one picked
    if (board.picked.length == 3) {
        let temp = board.picked.shift();
        setCardHighlight(temp.i, false);
    }

    // add the card that was just picked to the hand
    board.picked.push({i: i, v: board.cards[i]});
    setCardHighlight(i, true);

    // are there now three cards in the hand?  if so, check if they are a set.
    if (board.picked.length == 3) {
        let hand = [board.picked[0].v, board.picked[1].v, board.picked[2].v];
        if (isSet(hand)) {
            //log("That's a set!");
            setFound();
        } else {
            //log("That's not a set!");
            swal("Oops...", "Those cards don't form a set!", "error");
        }
    }
}

function setFound() {
    /*swal("Good job!", "You clicked the button!", "success");*/

    swal({
        title: "Set found!",
        text: "<canvas id='setFoundDisplay' width='"+3*card.w+"px' height='"+card.h()+"'></canvas>",
        html: true
    });
    confirmationCTX = $("#setFoundDisplay").get(0).getContext("2d");
    drawCard(confirmationCTX, 0*card.w+2,0+2,1*card.w-2,card.h()-2,3,board.picked[0].v);
    drawCard(confirmationCTX, 1*card.w+2,0+2,2*card.w-2,card.h()-2,3,board.picked[1].v);
    drawCard(confirmationCTX, 2*card.w+2,0+2,3*card.w-2,card.h()-2,3,board.picked[2].v);

    while (board.picked.length > 0) {
        let temp = board.picked.pop();
        setCardHighlight(temp.i, false);
    }
    board.picked = [];
}

function getMousePos(e) {
    let rect = canvas.getBoundingClientRect();
    return {x: e.clientX-rect.left, y: e.clientY-rect.top};
}

function log(msg) {
    console.log(msg);
    $("#status").eq(0).text(msg);
}

function showRules() {
    if (active == "board") {
        $("#div_game").css("top", "100vh");
        $("#div_rules").css("top", "5vh");
        active = "rules";
    } else if (active == "rules") {
        $("#div_game").css("top", "5vh");
        $("#div_rules").css("top", "100vh");
        active = "board";
    }

}

function setCardHighlight(i, highlighted) {
    let r = Math.round(card.h() / 20);
    let shadow = highlighted ? r + "px " + r + "px " + 3*r + "px " + cBlack : "none";
    $("#card"+i).css("box-shadow", shadow);
}
/**
 * Created by Theodore on 2/25/2017.
 *
 * TODO: page orientation to do layout -> long edge of card should be along long edge of page
 * TODO: Refactor using JS best practices
 * TODO: comment functions
 * TODO: score sets per user
 * TODO: add button to shuffle the board
 * TODO: 2x(6+) card layout for very long screens
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
let board = {w: 4
            , h: 3
            , inPlayMain: []
            , inPlayExtra: []
            , deck: []
            , picked: []};
let card = {ar: 1.56
            , w: 100
            , padAmnt: 0.2
            , pad: function(){
                    return (this.padAmnt / 2) * this.w
                }
            , thickness: 3
            , h: function(){
                    return this.ar*this.w
                }
            , shading: function(){
                    let c = Math.ceil(this.w/6);
                    return (c%2==1) ? c : c-1;
                }
            , posX: function(x0) {
                    let v = [];
                    for (let col=0; col<board.w; col++) {
                        v.push(x0+this.w*col+this.pad()*(col+1));
                    }
                    return v;
                }
            , posY: function(y0) {
                    let v = [];
                    for (let row = 0; row < board.h; row++) {
                        v.push(y0 + this.h() * row + this.pad() * (row + 1));
                    }
                    return v;
                }
            , posExtra: function(x0,y0) {
                    if (board.w == 4){
                        let x = this.posX(x0);
                        return 2 * x[3] - x[2];
                    } else {
                        let y = this.posY(y0);
                        return  2 * y[3] - y[2];
                    }
                }
            , rowcol2i: function(row, col) {
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

    while (board.inPlayMain.length < 12) {
        board.inPlayMain.push(board.deck.pop());
        console.log("Board now has " + board.inPlayMain.length + " inPlayMain");
    }

    if (!isSetAvailable()) {
        needExtraCards();
    }

    resizedWindow();
    drawBoard();

    //canvas.onclick = clickedBoard;
}

/** Function determines appropriate sizes for the canvas and inPlayMain in order to fit the window.
 *  Then calls a function to redraw the board.
 */
function resizedWindow() {
    let h = boardDiv.height();
    let w = boardDiv.width();

    ctx.canvas.height = h;
    ctx.canvas.width = w;

    if (h/(5*card.ar) > w/5) {
        board.h = 4;
        board.w = 3;
        card.w = (1-card.padAmnt) * Math.min(w / board.w, h / ((board.h+1) * card.ar));
    } else {
        board.h = 3;
        board.w = 4;
        card.w = (1-card.padAmnt) * Math.min(w / (board.w+1), h / (board.h * card.ar));
    }

    //card.w = 0.75 * Math.min(h / ((board.h+1) * card.ar), w / board.w);



    drawBoard();
}

/** Function draws the board.
 *  If more than 12 spaces are needed, it fills in extra rows or cols as orientation allows.
 */
function drawBoard() {
    w = Math.round(boardDiv.width());
    h = Math.round(boardDiv.height());
    ctx.clearRect(0,0,w,h);

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

    for (let row=0; row<board.h; row++) {
        for (let col=0; col<board.w; col++) {
            let x = Math.round(posX[col]);
            let y = Math.round(posY[row]);
            let i = card.rowcol2i(row,col);

            if (i >= board.inPlayMain.length) {
                break;
            }
            drawCard(ctx, x,y, x+cw, y+ch, card.thickness, board.inPlayMain[i]);

            $("#div_game").append($(buildDiv(x,y,cw,ch,i,false)));
        }
    }

    let f = Math.round(card.posExtra(0,0));
    let l = undefined, x = undefined, y = undefined;
    if (board.w == 4) {
        l = posY;
    } else {
        l = posX
    }
    for (let k=0; k<board.inPlayExtra.length; k++) {
        if (board.w == 4) {
            x = f;
            y = Math.round(l[k]);
        } else {
            x = Math.round(l[k]);
            y = f;
        }
        drawCard(ctx, x, y, x+cw, y+ch, card.thickness, board.inPlayExtra[k]);

        $("#div_game").append($(buildDiv(x,y,cw,ch,k,true)));
    }

    if (isSetAvailable()) {
        log("A set is available / " + board.deck.length + " cards unseen");
    } else {
        log("A set is not available / your score: " + String((81-(board.deck.length+board.inPlayExtra.length+board.inPlayMain.length))/3));
    }
}

function drawCard(ctx,x1,y1,x2,y2,thickness,info) {
    //console.log("drawing card at (" + x1 + ", " + y1 + ")");
    const w = x2-x1;
    const h = y2-y1;
    xm = (x1+x2)/2;
    ym = (y1+y2)/2;

    drawRectangleRounded(ctx,x1,y1,x2,y2,h/10,thickness);

    let locations = [ym];
    if (info.count == 2) {
        locations = [ym-h/6, ym+h/6];
    } else if (info.count == 3) {
        locations = [ym-7*h/24, ym, ym+7*h/24];
    }

    for (y of locations) {
        drawShape(ctx, xm, y, 2*w/3, 2*w/6, thickness, info.shape, info.fill, info.color);
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

function drawShape(ctx,x,y,w,h,thickness,shape,fill,color) {
    w = w / 2;
    h = h / 2;
    const lineCount = Math.floor(card.shading()/2);

    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.outlineStyle = color;
    ctx.fillStyle = color;

    ctx.beginPath();

    let outline = new Path2D();
    if (shape == sWave) {
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
        outline.moveTo(x + points[0].x * w / 4, y + points[0].y * h / 4);
        for (let i = 1; i < points.length; i++) {
            outline.quadraticCurveTo(x + control[i - 1].x * w / 4, y + control[i - 1].y * h / 4, x + points[i].x * w / 4, y + points[i].y * h / 4);
        }
    } else if (shape == sOval) {
        outline.moveTo(x-w+h,y-h);
        outline.lineTo(x+w-h,y-h);
        outline.arcTo(x+w,y-h,x+w,y,h);
        outline.arcTo(x+w,y+h,x+w-h,y+h,h);
        outline.lineTo(x-w+h,y+h);
        outline.arcTo(x-w,y+h,x-w,y,h);
        outline.arcTo(x-w,y-h,x-w+h,y-h,h);
    } else if (shape == sDiamond) {
        outline.moveTo(x,y-h);
        outline.lineTo(x+w,y);
        outline.lineTo(x,y+h);
        outline.lineTo(x-w,y);
        outline.lineTo(x,y-h);
    }
    outline.closePath();

    // draw the shape's fill
    if (fill==fEmpty) {
        ctx.lineWidth = thickness;
        ctx.stroke(outline);
    } else if (fill==fPartial) {
        let hash = new Path2D();
        for (let i=-lineCount+1; i<lineCount; i++) {
            hash.moveTo(x+i*w/lineCount, y-h);
            hash.lineTo(x+i*w/lineCount, y+h);
        }
        hash.closePath();

        // save in order to undo clip region
        ctx.save();
        ctx.clip(outline);
        ctx.lineWidth = (thickness > 1) ? Math.floor(thickness/3) : 1;
        ctx.stroke(hash);
        // restore in order to clear clip region
        ctx.restore();

        ctx.lineWidth = thickness;
        ctx.stroke(outline);
    } else if (fill==fSolid) {
        ctx.fill(outline);
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
    let comb = k_combinations(board.inPlayMain.concat(board.inPlayExtra), 3);


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

function buildDiv(x,y,w,h,i,inExtra) {
    let r = "<div class=card id=card"+i+(inExtra?"extra":"main")+" style=\"";
    r += "height: "+h+"px; ";
    r += "width: "+w+"px; ";
    r += "left: "+x+"px; ";
    r += "top: "+y+"px; ";
    r += "border-radius: "+h/10+"px; "
    r += "\" onclick=javascript:clickedCard("+i+","+inExtra+")";
    r += "></div>";
    return r;
}

function clickedCard(i, inExtra) {
    //log("Selected card #" + i);

    // has the card already been picked?  if so, remove it
    for (j in board.picked) {
        if (i == board.picked[j].i && inExtra == board.picked[j].inExtra) {
            //log("Deselected card #" + i);
            let temp = board.picked.splice(j, 1);
            setCardHighlight(temp[0].i, inExtra, false);
            return;
        }
    }

    // are there already three inPlayMain picked?  if so, removed the first one picked
    if (board.picked.length == 3) {
        let temp = board.picked.shift();
        setCardHighlight(temp.i, inExtra, false);
    }

    // add the card that was just picked to the hand
    board.picked.push({i: i, v: (inExtra?board.inPlayExtra[i]:board.inPlayMain[i]), inExtra: inExtra});
    setCardHighlight(i, inExtra, true);

    // are there now three inPlayMain in the hand?  if so, check if they are a set.
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

    swalWidth = Math.min(478, $(window).width() - 2*15 - 2*17);
    swal({
        title: "Set found!",
        text: "<canvas id='setFoundDisplay' width='"+swalWidth+"px' height='"+(swalWidth/3)*card.ar+"'></canvas>",
        html: true
    });
    confirmationCTX = $("#setFoundDisplay").get(0).getContext("2d");
    let w = swalWidth / 3
    drawCard(confirmationCTX, 0*w+2, 0+2, 1*w-2, card.ar*w-2, card.thickness, board.picked[0].v);
    drawCard(confirmationCTX, 1*w+2, 0+2, 2*w-2, card.ar*w-2, card.thickness, board.picked[1].v);
    drawCard(confirmationCTX, 2*w+2, 0+2, 3*w-2, card.ar*w-2, card.thickness, board.picked[2].v);

    for (let k=0; k<board.picked.length; k++) {
        let temp = board.picked[k]
        if (undefined != temp && temp.inExtra) {
            setCardHighlight(temp.i, temp.inExtra, false);
            board.inPlayExtra[temp.i] = undefined;
        }
    }
    board.inPlayExtra = board.inPlayExtra.filter(function(e) {return undefined != e});

    for (let k=0; k<board.picked.length; k++) {
        let temp = board.picked[k]
        if (undefined != temp && !temp.inExtra) {
            if (board.inPlayExtra.length > 0) {
                board.inPlayMain[temp.i] = board.inPlayExtra.pop();
            } else if  (board.deck.length > 0) {
                board.inPlayMain[temp.i] = board.deck.pop();
            } else {
                board.inPlayMain[temp.i] = undefined;
            }
        }
    }
    board.inPlayMain = board.inPlayMain.filter(function(e) {return undefined != e});

    board.picked = [];

    if (!isSetAvailable()) {
        needExtraCards();
    }

    drawBoard();
}

function needExtraCards() {
    while (board.inPlayExtra.length < 3 && board.deck.length > 0) {
        board.inPlayExtra.push(board.deck.pop());
    }
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
        $("#div_game").addClass("offScreen");
        $("#div_rules").removeClass("offScreen");
        active = "rules";
    } else if (active == "rules") {
        $("#div_game").removeClass("offScreen");
        $("#div_rules").addClass("offScreen");
        active = "board";
    }

}

function setCardHighlight(i, inExtra, highlighted) {
    let r = Math.round(card.h() / 20);
    let shadow = highlighted ? "0 0 " + 2 * r + "px " + 0.5 * r + "px " + cBlack : "none";
    $("#card"+i+(inExtra?"extra":"main")).css("box-shadow", shadow);
}
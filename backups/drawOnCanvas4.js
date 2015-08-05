window.onload = function () {
  alert ("function: onload");

  var canvas = document.getElementById("canvas"),
      context = canvas.getContext("2d"),
      width = canvas.width = 600,
      height = canvas.height = 400;

  var isDrawing;
  var normToSize = 100;
  var tracker;

  var aGui = new Gui (width, height, 3, 40);
  aGui.show (context);

  canvas.onmousedown = function(e) {
    isDrawing = true;
    tracker = [];
    tracker.push (new Point (e.clientX, e.clientY));
    context.moveTo(e.clientX-8, e.clientY-8);
    var tmp = aGui.whichBox (e.clientX, e.clientY);
    context.fillText(tmp.toString (), e.clientX, e.clientY);

    // context.fillText(e.clientX.toString () + " : " + e.clientY.toString (),
    //   e.clientX, e.clientY);

  };

  canvas.onmousemove = function(e) {
    if (isDrawing) {
      tracker.push (new Point (e.clientX, e.clientY));
      context.lineTo(e.clientX-8, e.clientY-8);
      // context.lineTo(e.clientX, e.clientY);
      context.strokeStyle = '#000000';
      context.lineCap = 'round';
      // context.lineWidth = 5;
      context.stroke();
    }
  };

  canvas.onmouseup = function(e) {
    isDrawing = false;
    context.fillText(tracker.length, e.clientX, e.clientY);

    tracker = [];
    tracker.push (new Point (100, 50));
    tracker.push (new Point (100, 200));
    // tracker.push (new Point (100, 50));
    // tracker.push (new Point (300, 55));
    drawLines (tracker);
    var tmp = Recognize (tracker, width, height, normToSize);
  };

  drawLines = function (pnts) {
    context.beginPath ();
    context.moveTo (pnts[0].x, pnts[0].y);
    for (var i=1; i<pnts.length; ++i) {
      context.lineTo (pnts[i].x, pnts[i].y);
      context.strokeStyle = '#000000';
      context.stroke ();
    }
  };

  // alert ("END");
};

function outputArr (id, arr) {
  var content = "";
  for (var i=0; i<arr.length; ++i) {
    content = content + arr[i] + "<br/>";
  }
  document.getElementById(id).innerHTML = content;
}

function outputStr (id, txt) {
  var content = "";
  document.getElementById(id).innerHTML = txt;
}

function Preprocess (data, origW, origH, normTo) {
  // alert ("Preprocess");
  var debug = [];

  /**********************************************
  * Normalize the data into one uniform scale of normToSize
  **********************************************/
  this.normalize = function() {
    // alert ("normalize");
    var xScale = normTo/origW;
    var yScale = normTo/origH;
    debug.push ("xScale: " + xScale);
    debug.push ("yScale: " + yScale);
    var dataNorm = [];
    for (var i=0; i<data.length; ++i) {
      dataNorm.push (new Point ( Math.round(data[i].x*xScale),
                                 Math.round(data[i].y*yScale)));
      debug.push (data[i].toStr () + " -> " + dataNorm[i].toStr ());
    }
    return dataNorm;
  }

  /**********************************************
  * check if there is a gap between two points
  **********************************************/
  this.isGap = function (pnt1, pnt2) {
    if ((Math.abs(pnt2.x - pnt1.x) > 1) || (Math.abs (pnt2.y-pnt1.y) > 1)) {
      return true;
    }
    return false;
  }

  /**********************************************
  * get orientation of a line between two points
  **********************************************/
  this.getOrientation = function (pnt1, pnt2) {
    // alert ("getOrientation");
    if ((pnt1.x == pnt2.x) && (pnt1.y == pnt2.y)) {
      return "point";
    }
    else if (pnt1.x == pnt2.x) {
      return "vertical";
    }
    else if (pnt1.y == pnt2.y) {
      return "horizontal";
    }
    else if ((pnt1.x < pnt2.x) && (pnt1.y > pnt2.y)) {
      return "rising";
    }
    else if ((pnt1.x < pnt2.x) && (pnt1.y < pnt2.y)) {
      return "falling";
    }
    else if ((pnt1.x > pnt2.x) && (pnt1.y > pnt2.y)) {
      return "falling";
    }
    else if ((pnt1.x > pnt2.x) && (pnt1.y < pnt2.y)) {
      return "rising";
    }
    else {
      return "invalid";
    }
  }

  var dataNorm = this.normalize ();
  var pnt1 = dataNorm[0];
  for (var i=1; i<dataNorm.length; ++i) {
    var pnt2 = dataNorm[i];
    if (this.isGap (pnt1, pnt2)) {
      debug.push ("Gap: " + pnt1.toStr () + " -> " + pnt2.toStr ());
      debug.push ("orientation: " + this.getOrientation (pnt1, pnt2));
    }
    pnt1 = pnt2;
  }

  outputArr ("debug", debug);
}

function Recognize (data, width, height, normToSize) {
  // alert ("recognize: 1");
  var dataProc = new Preprocess (data, width, height, normToSize);
  // var features = new Features (data);
  // alert ("recognize: 1");
  // features.show ();
  // alert (data.length);


}

function Gui (sizeX, sizeY, menuCnt, menuHeight) {
  this.canvX = sizeX;
  this.canvY = sizeY;
  this.menuCnt = menuCnt;
  this.eachMenuHeight = menuHeight;

  this.board = new Box (0, 0, Math.floor (this.canvX*.9), this.canvY);
  this.menu = new Box (Math.ceil (this.canvX*.9), 0,
    this.canvX - this.board.lenX, this.eachMenuHeight*this.menuCnt);

  this.menuBoxes = Array (this.menuCnt);
  for (var i=0; i<menuCnt; ++i) {
      this.menuBoxes[i] = new Box (this.menu.tl.x+0, i*this.eachMenuHeight,
          this.menu.lenX, this.eachMenuHeight);
  }
  // alert (this.menuBoxes.length);

  this.whichBox = function (x, y) {
    if (this.board.isIn (x, y)) {
      return 1;
    }
    else {
      for (var i=0; i<this.menuBoxes.length; ++i) {
        if (this.menuBoxes[i].isIn (x, y)) {
          return 1 + i + 1;
        }
      }
    }

    return -1;
  }

  this.show = function (e) {
    e.rect (this.board.tl.x, this.board.tl.y, this.board.lenX, this.board.lenY);
    e.rect (this.menu.tl.x, this.menu.tl.y, this.menu.lenX, this.menu.lenY);
    for (var i=0; i<this.menuBoxes.length; ++i) {
        e.rect (this.menuBoxes[i].tl.x, this.menuBoxes[i].tl.y,
          this.menuBoxes[i].lenX, this.menuBoxes[i].lenY);
      }
    e.stroke ();
  }
}

function Box (x, y, _lenX, _lenY) {
  this.lenX = _lenX;
  this.lenY = _lenY;
  this.tl = new Point (x, y);
  this.tr = new Point (x + this.lenX, y);
  this.bl = new Point (x, y + this.lenY);
  this.br = new Point (x + this.lenX, y + this.lenY);


  this.isIn = function (x, y) {
    if ((x > this.tl.x && x < this.br.x) && (y > this.tl.y && y < this.br.y)) {
      return true;
    }
    return false;
  }

  this.show = function (e) {
    e.rect (this.tl.x, this.tl.y, this.lenX, this.lenY);
    e.stroke ();
  }
}

function Point(lhs, rhs) {
  this.x = lhs;
  this.y = rhs;

  this.show = function (e) {
    e.fillText("here", this.x, this.y);
  }

  this.toStr = function () {
    return "(" + this.x.toString () + ", " + this.y.toString () + ")";
  }
}
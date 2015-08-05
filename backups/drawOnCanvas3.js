window.onload = function () {
  alert ("function: onload");

  var canvas = document.getElementById("canvas"),
      context = canvas.getContext("2d"),
      width = canvas.width = 600,
      height = canvas.height = 400;

  var isDrawing;
  var sizeGrid = 100;
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
    var sizeGrid = 100;
    context.fillText(tracker.length, e.clientX, e.clientY);

    tracker = [];
    tracker.push (new Point (100, 50));
    tracker.push (new Point (100, 200));
    drawLines (tracker);
    var tmp = Recognize (tracker, sizeGrid);
  };

  drawLines = function (pnts) {
    alert ("drawLines");
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

function Recognize (data, sizeGrid) {
  // alert ("recognize: 1");
  var dataProc = new Preprocess (data, sizeGrid);
  // var features = new Features (data);
  // alert ("recognize: 1");
  // features.show ();
  // alert (data.length);


}

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

function Preprocess (data, sizeGrid) {
  var debug = [];

  // alert ("Preprocess: " + sizeGrid);
  this.grid = [];
  for (var r = 0; r < sizeGrid; ++r) {
    this.grid[r] = [];
    for (var c = 0; c < sizeGrid; ++c) {
      this.grid[r][c] = 0;
    }
  }

  debug.push ("point 0 : " + data[0].x + ", " + data[0].y);
  var xMin = data[0].x;
  var xMax = data[0].x;
  var yMin = data[0].y;
  var yMax = data[0].y;
  for (var i=1; i<data.length; ++i) {
    debug.push ("point " + i + " : " + data[i].x + ", " + data[i].y);
    if (data[i].x < xMin) {
      xMin = data[i].x;
    }
    if (data[i].x > xMax) {
      xMax = data[i].x;
    }
    if (data[i].y < yMin) {
      yMin = data[i].y;
    }
    if (data[i].y > yMax) {
      yMax = data[i].y;
    }
  }
  debug.push ("xMax : " + xMax);
  debug.push ("xMin : " + xMin);
  debug.push ("yMax : " + yMax);
  debug.push ("yMin : " + yMin);

  var xLen = 0;
  var yLen = 0;
  xLen = xMax - xMin;
  yLen = yMax - yMin;
  debug.push ("xLen : " + xLen);
  debug.push ("yLen : " + yLen);
  var xUnit = xLen / sizeGrid;
  var yUnit = yLen / sizeGrid;
  debug.push ("xUnit : " + xUnit);
  debug.push ("xUnit : " + yUnit);

  this.isGap = function (pnt1, pnt2) {
    if ((Math.abs(pnt2.x - pnt1.x) > 1) || (Math.abs (pnt2.y-pnt1.y) > 1)) {
      return true;
    }
    return false;
  }


  this.getOrientation = function (pnt1, pnt2) {
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
    else if ((pnt1.x > pnt2.x) && (pnt1.y < pnt2.y)) {
      return "falling";
    }
    else {
      return "invalid";
    }
  }

  /**********************************************
  * Equation for a line between two points (x1, y1) and (x2, y2):
  * y = mx + b; x = (y-b)/m
  * m = (y1 - y2) / (x1 - x2)
  * b = y - mx
  **********************************************/
  this.fillGap = function (pnt1, pnt2) {
    var m = (pnt1.y - pnt2.y) / (pnt1.x - pnt2.x);
    var b = pnt1.y - m*pnt1.x;
    var pntsGap = [];
    var xMin = pnt1.x;
    var yMin = pnt1.y;
    var xMax = pnt2.x;
    var yMax = pnt2.y;

    if (xMax < xMin) {
      xMin = xMax;
      xMax = pnt1.x;
    }
    if (yMax < yMin) {
      yMin = yMax;
      yMax = pnt1.y;
    }

    var orientation = this.getOrientation (pnt1, pnt2);
    debug.push ("orientation: " + orientation);
    if (orientation.localeCompare ("vertical") == 0) {
      for (var y=yMin+1; y<yMax; ++y) {
        debug.push ("x = " + Math.round ((y - b) / m));
        debug.push ("y = " + y);
    //     pntsGap.push (new Point (Math.round ((y - b) / m), y);
      }
    }
    // else if (orientation.localeCompare ("horizontal") == 0) {
    //   for (var x=xMin+1; x<xMax; ++x) {
    //     pntsGap.push (new Point (x, Math.round (m*x + b)));
    //   }
    // }
    // else if (orientation.localeCompare ("point") == 0 ||
    //   orientation.localeCompare ("invalid") == 0) {
    //   // handle if it is just a point
    // }
    // else {
    //   for (var x=xMin+1; x<xMax; ++x) {
    //     pntsGap.push (new Point (x, Math.round (m*x + b));
    //   }
    // }

    return pntsGap;
  }

  var prev = new Point (Math.round((data[0].x-xMin)/xUnit),
                        Math.round((data[0].y-yMin)/yUnit));
  debug.push ("trans : (" + (data[0].x) + ", " + (data[0].y) + ") -> "
    + prev.toStr ());
  for (var i=1; i<data.length; ++i) {
    var curr = new Point (Math.round((data[i].x-xMin)/xUnit),
                          Math.round((data[i].y-yMin)/yUnit));
    debug.push ("trans : (" + (data[i].x) + ", " + (data[i].y) + ") -> "
    + curr.toStr ());
    debug.push ("transformed : " + curr.toStr ());
    if (this.isGap (prev, curr)) {
      debug.push ("Gap : " + prev.toStr () + " -> " + curr.toStr ());
      var fillPnts = this.fillGap (prev, curr);
      for (var i=0; i<fillPnts.length; ++i) {
        // debug.push ("gap pnts: " + fillPnts.toStr ());
        this.grid[fillPnts[i].x][fillPnts[i].x] = 1;
      }
    }
    else {
      debug.push ("NO Gap : " + prev.toStr () + " -> " + curr.toStr ());
      this.grid[Math.round(data[i].x/xUnit)][Math.round(data[i].y/yUnit)] = 1;
    }
    prev = curr;

    break;
  }

  outputArr ("debug", debug);
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
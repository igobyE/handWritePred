window.onload = function () {
  // alert ("function: onload");

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

    // tracker = [];
    // tracker.push (new Point (100, 50));
    // tracker.push (new Point (121, 50));
    // tracker.push (new Point (121, 71));
    // tracker.push (new Point (100, 71));
    // tracker.push (new Point (100, 51));

    // tracker.push (new Point (100, 50));
    // tracker.push (new Point (120, 70));
    // tracker.push (new Point (140, 50));
    // tracker.push (new Point (120, 30));
    // tracker.push (new Point (100, 50));
    // drawLines (tracker);
    var tmp = Recognize (tracker, width, height, normToSize);
    FeatureExtract (tmp);
    drawLines (tmp);
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
/************************************************
* 0: direction to top right (tr)
* 1: direction to right (r)
* 2: direction to bottom right (br)
* 3: direction to bottom (b)
* 4: direction to bottom left (bl)
* 5: direction to left (l)
* 6: direction to top left (tl)
* 7: direction to top (t)
************************************************/
function GetDirection (pnt1, pnt2) {
  if ((pnt1.x < pnt2.x) && (pnt1.y > pnt2.y)) {
    return 0;
  }
  else if ((pnt1.x < pnt2.x) && (pnt1.y == pnt2.y)) {
    return 1;
  }
  else if ((pnt1.x < pnt2.x) && (pnt1.y < pnt2.y)) {
    return 2;
  }
  else if ((pnt1.x == pnt2.x) && (pnt1.y < pnt2.y)) {
    return 3;
  }
  else if ((pnt1.x > pnt2.x) && (pnt1.y < pnt2.y)) {
    return 4;
  }
  else if ((pnt1.x > pnt2.x) && (pnt1.y == pnt2.y)) {
    return 5;
  }
  else if ((pnt1.x > pnt2.x) && (pnt1.y > pnt2.y)) {
    return 6;
  }
  else if ((pnt1.x == pnt2.x) && (pnt1.y > pnt2.y)) {
    return 7;
  }
}

/***********************************************
* Extract the following features in an associative array
* 0: xLen,
* 1: yLen,
* 2: ratio,
* 3: percAboveHoriz,
* 4: percBelowHoriz,
* 5: percOnRight,
* 6: percOnLeft,
* 7: avgDistFromCent
* 8: precentage of direction to top right (tr)
* 9: precentage of direction to right (r)
* 10: precentage of direction to bottom right (br)
* 11: precentage of direction to bottom (b)
* 12: precentage of direction to bottom left (bl)
* 13: precentage of direction to left (l)
* 14: precentage of direction to top left (tl)
* 15: precentage of direction to top (t)
***********************************************/
function FeatureExtract (data) {
  var debug = [];
  var features = [];
  /**********************************************
  * Get Max of x and y
  **********************************************/
  var xMax = data[0].x;
  var yMax = data[0].y;
  var cntDirections = [0, 0, 0, 0, 0, 0, 0, 0];
  var pnt1 = data[0];
  for (var i=1; i<data.length; ++i) {
    xMax = (data[i].x > xMax) ? data[i].x : xMax;
    yMax = (data[i].y > yMax) ? data[i].y : yMax;
    var pnt2 = data[i];
    cntDirections[GetDirection (pnt1, pnt2)] += 1;
    pnt1 = pnt2;
  }
  // for (var i=0; i<cntDirections.length; ++i) {
  //   debug.push ("cntDirections: "+ i + " = " + cntDirections[i]);
  // }
  features.push (xMax);
  features.push (yMax);
  features.push (yMax/xMax);

  var xMid = xMax/2;
  var yMid = yMax/2;
  debug.push ("xMid: " + xMid);
  debug.push ("yMid: " + yMid);
  var cntAbove = 0;
  var cntBelow = 0;
  var cntRight = 0;
  var cntLeft = 0;
  var totDistFromCent = 0;
  for (var i=0; i<data.length; ++i) {
    // debug.push ("data[i].x: " + data[i].x);
    // debug.push ("data[i].y: " + data[i].y);
    if (data[i].y < yMid) {
      cntAbove += 1
    }
    else if (data[i].y > yMid) {
      cntBelow += 1
    }

    if (data[i].x > xMid) {
      cntRight += 1;
    }
    else if (data[i].x < xMid) {
      cntLeft += 1;
    }
    // debug.push ("cntAbove: " + cntAbove);
    // debug.push ("cntBelow: " + cntBelow);
    // debug.push ("cntRight: " + cntRight);
    // debug.push ("cntLeft: " + cntLeft);
    /********************************************
    * distance between a point and center: sqrt ((x2-x1)^2 + (y2-y1)^2)
    ********************************************/
    totDistFromCent += Math.sqrt (Math.pow(((data[i].x) - (xMid)), 2) +
                       Math.pow(((data[i].y) - (yMid)), 2));
    // debug.push ("totDistFromCent: " + totDistFromCent);
    // break;
  }
  features.push (cntAbove/data.length);
  features.push (cntBelow/data.length);
  features.push (cntRight/data.length);
  features.push (cntLeft/data.length);
  features.push (totDistFromCent/data.length);
  for (var i=0; i<cntDirections.length; ++i) {
    features.push (cntDirections[i]/data.length);
  }

  for (var i=0; i<features.length; ++i) {
    debug.push ( i + ": " + features[i]);
  }
  outputArr ("debug", debug);
}

function outputArr (id, arr) {
  var content = "";
  for (var i=0; i<arr.length; ++i) {
    content = content + arr[i] + "<br/>";
  }
  content += " - - - - - - - - - - <br/>";
  document.getElementById(id).innerHTML = content;
}

function outputStr (id, txt) {
  var content = "";
  document.getElementById(id).innerHTML = txt;
}

/************************************************
* Preprocess transform the data based on (0, 0). It also fills the
* gap between two points. Filling the gaps were needed because the mousemove
* does not capture all of the pixel movements.
************************************************/
function Preprocess (data, origW, origH, normTo) {
  // alert ("Preprocess");
  var debug = [];

  /**********************************************
  * transform to (0, 0) -> (lenX, lenY)
  **********************************************/
  this.transform = function() {
    // alert ("normalize");
    var xMin = data[0].x;
    var yMin = data[0].y;
    for (var i=1; i<data.length; ++i) {
      xMin = (data[i].x < xMin) ? data[i].x : xMin;
      yMin = (data[i].y < yMin) ? data[i].y : yMin;
    }
    // debug.push ("xMin: " + xMin);
    // debug.push ("yMin: " + yMin);

    var dataTrans = [];
    for (var i=0; i<data.length; ++i) {
      dataTrans.push (new Point ( (data[i].x-xMin), (data[i].y-yMin)));
      // debug.push (data[i].toStr () + " -> " + dataTrans[i].toStr ());
    }

    return dataTrans;
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

  /**********************************************
  * Equation for a line between two points (x1, y1) and (x2, y2):
  * y = mx + b; x = (y-b)/m
  * m = (y1 - y2) / (x1 - x2)
  * b = y - mx
  **********************************************/
  this.fillGap = function (pnt1, pnt2) {
    // alert ("fillGap");
    var xMin = (pnt1.x < pnt2.x) ? pnt1.x : pnt2.x;
    var yMin = (pnt1.y < pnt2.y) ? pnt1.y : pnt2.y;
    var xMax = (pnt1.x > pnt2.x) ? pnt1.x : pnt2.x;
    var yMax = (pnt1.y > pnt2.y) ? pnt1.y : pnt2.y;

    var pntsGap = [];
    var orientation = this.getOrientation (pnt1, pnt2);
    // debug.push ("orientation: " + orientation);
    if (orientation.localeCompare ("vertical") == 0) {
      if (pnt1.y < pnt2.y) {
        for (var y=pnt1.y+1; y<pnt2.y; ++y) {
          pntsGap.push (new Point (xMin, y));
        }
      }
      else {
        for (var y=pnt1.y-1; y>pnt2.y; --y) {
          pntsGap.push (new Point (xMin, y));
        }
      }
    }
    else if (orientation.localeCompare ("horizontal") == 0) {
      if (pnt1.x < pnt2.x) {
        for (var x=pnt1.x+1; x<pnt2.x; ++x) {
          pntsGap.push (new Point (x, yMin));
        }
      }
      else {
        for (var x=pnt1.x-1; x>pnt2.x; --x) {
          pntsGap.push (new Point (x, yMin));
        }
      }
    }
    else if (orientation.localeCompare ("rising") == 0 ||
             orientation.localeCompare ("falling") == 0) {
      var m = (pnt1.y - pnt2.y) / (pnt1.x - pnt2.x);
      var b = pnt1.y - m*pnt1.x;
      if ( ((pnt1.x < pnt2.x) && (pnt1.y > pnt2.y)) ||
           ((pnt1.x < pnt2.x) && (pnt1.y < pnt2.y)) ) {
        for (var x=pnt1.x+1; x<pnt2.x; ++x) {
          pntsGap.push (new Point (x, Math.round (m*x + b)));
        }
      }
      else {
        for (var x=pnt1.x-1; x>pnt2.x; --x) {
          pntsGap.push (new Point (x, Math.round (m*x + b)));
        }
      }
    }
    else {
      alert ("BAD");
    }

    return pntsGap;
  }

  var dataNorm = this.transform ();
  // debug.push ("dataNorm length: " + dataNorm.length);
  var dataFlld = [];
  var pnt1 = dataNorm[0];
  dataFlld.push (new Point (pnt1.x, pnt1.y));
  for (var i=1; i<dataNorm.length; ++i) {
    // debug.push ("i: " + i);
    var pnt2 = dataNorm[i];
    if (this.isGap (pnt1, pnt2)) {
      // debug.push ("Gap: " + pnt1.toStr () + " -> " + pnt2.toStr ());
      var pntsOnGap = this.fillGap (pnt1, pnt2);
      for (var j=0; j<pntsOnGap.length; ++j) {
        dataFlld.push (new Point (pntsOnGap[j].x, pntsOnGap[j].y));
      }
    }
    dataFlld.push (new Point (pnt2.x, pnt2.y));
    pnt1 = pnt2;
  }
  for (var i=0; i<dataFlld.length; ++i) {
    // debug.push ("filled: " + dataFlld[i].toStr ());
  }

  // outputArr ("debug", debug);
  return dataFlld;
}



function Recognize (data, width, height, normToSize) {
  // alert ("recognize: 1");
  var dataProc = new Preprocess (data, width, height, normToSize);

  return dataProc;
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
window.onload = function() {
  // var el = document.getElementById('c');
  // var ctx = el.getContext('2d');
  var canvas = document.getElementById("canvas"),
      context = canvas.getContext("2d"),
      width = canvas.width = 600,
      height = canvas.height = 400;

  var isDrawing;
  var sizeGrid = 100;
  var tracker;
  // var aPoint;
  // var aBox = new Box (100, 100, 20, 20);
  // aBox.show (context);
  var aGui = new Gui (width, height, 3, 40);
  aGui.show (context);

  canvas.onmousedown = function(e) {
    isDrawing = true;
    tracker = [];
    context.moveTo(e.clientX, e.clientY);
    var tmp = aGui.whichBox (e.clientX, e.clientY);
    context.fillText(tmp.toString (), e.clientX, e.clientY);

    context.fillText(e.clientX.toString () + " : " + e.clientY.toString (),
      e.clientX, e.clientY);

  };

  canvas.onmousemove = function(e) {
    if (isDrawing) {
      tracker.push (new Point (e.clientX, e.clientY));
      context.lineTo(e.clientX-5, e.clientY-5);
      context.strokeStyle = '#000000';
      context.lineCap = 'round';
      context.lineWidth = 5;
      context.stroke();
    }
  };

  canvas.onmouseup = function(e) {
    isDrawing = false;
    // var tmp = tracker.length;
    // alert ("onmouseup: " + tmp.toString ());
    // context.fillText(tmp.toString (), e.clientX, e.clientY);
    // alert ("onmouseup: 1");
    // var rec = recognize (tracker);


    // context.beginPath ();
    // context.moveTo (tracker[0].x, tracker[0].y);
    // for (var i=1; i<tracker.length; ++i) {
    //   context.lineTo (tracker[i].x, tracker[i].y);
    //   context.strokeStyle = '#ffffff';
    //   context.stroke ();
    // }
  };

  context.beginPath ();
  context.moveTo (500, 380);
  context.lineTo (600, 380);
  context.strokeStyle = '#000000';
  context.stroke ();

};

function recognize (data, sizeGrid) {
  // var sizeGrid = 100;
  // alert ("recognize: 1");
  // var dataProc = new Preprocess (data, sizeGrid);
  // var features = new Features (data);
  // alert ("recognize: 1");
  // features.show ();
  // alert (data.length);


}

function Preprocess (data, sizeGrid) {
  // this.grid = [];
  // for (var r = 0; r < sizeGrid; ++r) {
  //   this.grid[r] = [];
  //   for (var c = 0; c < sizeGrid; ++c) {
  //     this.grid[r][c] = 0;
  //   }
  // }
  // alert (this.grid[0][5]);
  // alert (this.grid[9][9]);

  // var xMin = data[0].x;
  // var xMax = data[0].x;
  // var xLen = 0;
  // var xUnit = 0;
  // var yMin = data[0].y;
  // var yMax = data[0].y;
  // var yLen = 0;
  // var yUnit = 0;
  // for (var i=1; i<data.length; ++i) {
  //   if (data[i].x < xMin) {
  //     xMin = data[i].x;
  //   }
  //   if (data[i].x > xMax) {
  //     xMax = data[i].x;
  //   }
  //   if (data[i].y < yMin) {
  //     yMin = data[i].y;
  //   }
  //   if (data[i].y > yMax) {
  //     yMax = data[i].y;
  //   }
  // }
  // xLen = xMax - xMin;
  // yLen = yMax - yMin;
  // xUnit = xLen / sizeGrid;
  // yUnit = yLen / sizeGrid;

  // this.isGap = function (pnt1, pnt2) {
  //   if ((Math.abs(pnt2.x - pnt1.x) > 1) || (Math.abs (pnt2.y-pnt1.y) > 1)) {
  //     return true;
  //   }
  //   return false;
  // }
  // var prev = new Point (Math.round(data[0].x/xUnit),
  //                       Math.round(data[0].y/xUnit));
  // for (var i=1; i<data.length; ++i) {
  //   var curr = new Point (Math.round(data[i].x/xUnit),
  //                         Math.round(data[i].y/xUnit));
  //   if (this.isGap (prev, curr)) {
  //     alert ("Gap: " + prev.toStr () + " -> " + curr.toStr ());
  //   }
  //   else {
  //     alert ("NO Gap: " + prev.toStr () + " -> " + curr.toStr ());
  //     this.grid[Math.round(data[i].x/xUnit)][Math.round(data[i].y/yUnit)] = 1;
  //   }
  //   prev = curr;
  // }


}

// function Features (data) {
//   var xMin = data[0].x;
//   var xMax = data[0].x;
//   var yMin = data[0].y;
//   var yMax = data[0].y;

//   /*
//     0: xLen:0,
//     1: yLen:0,
//     2: ratio:0,
//     3: percAboveHoriz:0,
//     4: percBelowHoriz:0,
//     5: percOnRight:0,
//     6: percOnLeft:0,
//     7: avgDistFromCent:0
//   */
//   this.features = [];
//   this.features[0] = 0;
//   this.features[1] = 0;
//   this.features[2] = 0;
//   this.features[3] = 0;
//   this.features[4] = 0;
//   this.features[5] = 0;
//   this.features[6] = 0;
//   this.features[7] = 0;
//   // alert ("Feature: 1");

//   for (var i=1; i<data.length; ++i) {
//     if (data[i].x < xMin) {
//       xMin = data[i].x;
//     }
//     if (data[i].x > xMax) {
//       xMax = data[i].x;
//     }
//     if (data[i].y < yMin) {
//       yMin = data[i].y;
//     }
//     if (data[i].y > yMax) {
//       yMax = data[i].y;
//     }
//   }

//   // alert ("Feature: 1");

//   var xMed = (xMax + xMin) / 2;
//   var yMed = (yMax + yMin) / 2;
//   this.features[0] = xMax - xMin;
//   this.features[1] = yMax - yMin;
//   this.features[2] = this.features[0]/this.features[1];

//   alert ("xMax: " + xMax.toString ());
//   alert ("xMin: " + xMin.toString ());
//   alert ("yMax: " + yMax.toString ());
//   alert ("yMin: " + yMin.toString ());
//   alert ("xMed: " + xMed.toString ());
//   alert ("yMed: " + yMed.toString ());

//   // alert (xMax.toString () + " - " + xMid.toString () + " - " + xMin.toString ());
//   // alert (yMax.toString () + " - " + yMid.toString () + " - " + yMin.toString ());

//   for (var i=0; i<data.length; ++i) {
//     if (data[i].x > xMed) {
//       this.features[3] += 1;
//     }
//     if (data[i].x < xMed) {
//       this.features[4] += 1;
//     }
//     if (data[i].y > yMed) {
//       this.features[5] += 1;
//     }
//     if (data[i].y < yMed) {
//       this.features[6] += 1;
//     }

//     // alert ("Feature: " + i.toString ());
//     // distance between a point and center: sqrt ((x2-x1)^2 + (y2-y1)^2)
//     var tmpX = Math.pow(((data[i].x) - (xMed)), 2);
//     var tmpY = Math.pow(((data[i].y) - (yMed)), 2);
//     // alert (tmpX.toString () + " : " + tmpY.toString ());
//     this.features[7] += Math.sqrt (tmpX + tmpY);
//     // alert (this.features[7]);
//   }

//   // alert ("Feature: 3");

//   this.features[3] /= data.length;
//   this.features[4] /= data.length;
//   this.features[5] /= data.length;
//   this.features[6] /= data.length;
//   this.features[7] /= data.length;


//   this.show = function () {

//     // alert ("here 3");
//     for (var i=0; i<this.features.length; ++i) {
//       alert (i.toString () + ": " + this.features[i]);
//       // e.fillText(this.features[i], 100, 100 + (i*20));
//     }
//     // e.fillText((this.features.length).toString (), 100, 100);
//   }
// }

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

  this.toStr () {
    return "(" + this.x.toString () + ", " + this.y.toString () + ")";
  }
}
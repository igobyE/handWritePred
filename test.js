window.onload = function () {
  alert ("function: onload");
  var arr = ["one", "two", "three"];
  var notArr = "one";
  output ("debug", notArr);
};

function output (id, arr) {
	alert ("function: output - " + arr.length);
	var content = "";
	for (var i=0; i<arr.length; ++i) {
		content = content + arr[i] + "<br>";
	}
	document.getElementById(id).innerHTML = content;
}
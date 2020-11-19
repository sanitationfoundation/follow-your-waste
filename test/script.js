// window.onload = function() {
//   var divs = document.querySelectorAll(".svg");
//   divs.forEach(function(div) {
//     var src = div.dataset.src,
//         xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//         div.innerHTML = xhttp.responseText;
//         var svg = div.querySelector("svg");
//         // startAnim(svg);
//       }
//     };
//     xhttp.open("GET", src, true);
//     xhttp.send();
//   });
// }


lottie.loadAnimation({
	container: document.querySelector("body"), // the dom element that will contain the animation
	renderer: 'svg',
	loop: false,
	autoplay: true,
	path: "01.json" // the path to the animation json
});
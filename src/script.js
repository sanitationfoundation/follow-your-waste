import { animations } from "animate.js";
// import { lottie } from "lottie-web";
import { gsap } from "gsap";
require("./style.scss");

const CLIENT_ID = "913312390321-6pahjln9b949e3rssp5gcm9p25205cno.apps.googleusercontent.com",
			API_KEY = "AIzaSyCgQu-HbqXUm2t1fHWR-5LvLbhuhAwEpuo",
			DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
			SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly",
			SPREADSHEET_ID = "19q-rYI2S0n5iISWPtIUgqdMbwFMLjNeEJsX5yDlpx4c",
			streamSlugs = ["landfill","metal","glass","plastic","paper"],
			body = document.querySelector("body"),
			html = document.querySelector("html"),
			lang = html.attributes.lang,
			rootPath = html.dataset.rootPath,
			docElem = document.documentElement,
			fullToggle = document.querySelector("#full-toggle"),
			introView = document.querySelector("#intro-view"),
			startButtn = document.querySelector("#intro-button"),
			selectView = document.querySelector("#select-view"),
			streamsView = document.querySelector("#streams-view"),
			streamElems = document.querySelectorAll(".stream"),
			itemsWrap = document.querySelector("#items-wrap"),
			itemElems = document.querySelectorAll(".item"),
			itemsArr = [],
			binsArr = [],
			scenesArr = [],
			streamsArr = [];
let itemsWrapPackery, currStream;

window.streams = {
	landfill: "Landfill",
	metal: "Metal",
	glass: "Glass",
	plastic: "Plastic",
	paper: "Paper"
};
window.streamSlug = "";


window.onload = () => {
	setUpStreamSelect();

	fullToggle.onclick = toggleFullscreen;

	// if(isIframe()) {
	// 	body.classList.add("full");
	// }
};


window.onresize = () => {
	scenesArr.forEach((sceneObj) => {
		if(sceneObj.marker) {
			sceneObj.fixTooltip();
		};
	});
	if(body.id == "select" && itemsWrap.classList.contains("setup")) {
		itemsWrapPackery.layout();
	}
};

document.onkeydown = (e) => {
	e = e || window.event;
	const keyCode = e.keyCode ? e.keyCode : e.which;

	switch(keyCode) {
		case 27:
			body.classList.remove("full");
			closeFullscreen();
			break;
		case 37:
			currStream.goToPrevScene();
			break;
		case 39:
			currStream.goToNextScene();
			break;
		case 77:
			const currAudioElem = currStream.elem.querySelector(".caption.show audio");
			body.classList.toggle("mute");
			if(body.classList.contains("mute")) {
				currAudioElem.pause();
			} else {
				currAudioElem.play();
			}
			break;
	}
};

document.onfullscreenchange = (e) => {
	if(document.fullscreenElement) {
		body.classList.add("full");
	} else {
		body.classList.remove("full");
	}
}

const toggleFullscreen = (e) => {
	body.classList.toggle("full");
	if(body.classList.contains("full")) {
		openFullscreen();
	} else {
	  closeFullscreen();
	}
}

const openFullscreen = (e) => {
	if(docElem.requestFullscreen && !document.fullscreenElement) {
    docElem.requestFullscreen();
  }
}

const closeFullscreen = (e) => {
	if(document.exitFullscreen && document.fullscreenElement) {
    document.exitFullscreen();
  }
}

const isIframe = (e) => {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}

/************************************/
/************STREAM SELECT***********/
/************************************/

const setUpStreamSelect = () => {

	itemElems.forEach(function(itemElem) {
		const slug = itemElem.dataset.item,
					itemObj = new Item(itemElem);
		itemsArr[slug] = itemObj;
	});

	streamElems.forEach(function(streamElem) {
		const slug = streamElem.dataset.slug,
					streamObj = new Stream(streamElem);
		streamsArr[slug] = streamObj;
	});

	// const div = document.createElement('div');
 //  div.innerHTML = '<svg/>';
 //  if((div.firstChild && div.firstChild.namespaceURI) != 'http://www.w3.org/2000/svg') {
	// 	body.classList.add("lite-only");
	// }
}

const handleStreamSelect = () => {
	// body.id = "select";
	const items = itemsWrap.querySelectorAll(".item");

	itemsWrapPackery = new Packery(itemsWrap, {
		itemSelector: '.item',
		transitionDuration: 200,
		resize: true,
		gutter: 40,
	});
	itemsWrap.classList.add("setup");

	const binElems = selectView.querySelectorAll("#bins .bin");
	binElems.forEach(function(binElem, i) {
		const bin = new Bin(binElem);
	});
}

const showAlert = (alertSlug, onClick) => {
	body.classList.add("alerts");
	const alertElem = document.querySelector("[data-alert='"+alertSlug+"']"),
				buttonElem = alertElem.querySelector(".button");
	alertElem.classList.add("show");
	buttonElem.onclick = (e) => {
		alertElem.classList.remove("show");
		body.classList.remove("alerts");
		if(onClick) {
			onClick();
		}
	};
}

/************************************/
/*****************ITEM***************/
/************************************/

class Item {
	constructor(elem) {
		self = this;
		this.elem = elem;
		this.item = elem.dataset.item;
		this.stream = elem.dataset.stream;
		this.image = elem.querySelector("img");
		this.tooltip = elem.querySelector(".tooltip");
		
		$(elem).draggable({
			containment: selectView,
			scroll: false,
			start: this.onStartDragItem.bind(this),
			stop: this.onStopDragItem.bind(this),
		  drag: this.onDragItem.bind(this),
		});

		elem.onmouseover = () => {
			elem.classList.add("hovering");
			if(!body.classList.contains("dragging")) {
				// elem.parentNode.appendChild(elem);
			}
			self.fixTooltip();
		};

		elem.onmouseleave = () => {
			elem.classList.remove("hovering");
		};
	};

	onStartDragItem(e, ui) {
		const itemElem = e.target;
		if(itemElem.dataset.origin == undefined) {
			const origin = [ui.originalPosition.left,ui.originalPosition.top];
			itemElem.dataset.origin = JSON.stringify(origin);
		}
		body.classList.add("dragging");
	}

	onStopDragItem(e, ui) {
		body.classList.remove("dragging");
	}

	onDragItem(e, ui) {
		const itemElem = e.target,
					itemHeight = itemElem.clientHeight,
					itemTop = ui.position.top,
					itemBottom = itemHeight + itemTop;
		this.fixTooltip();
	}

	returnItem(bin) {
		const itemElem = this.elem,
					itemBounds = itemElem.getBoundingClientRect(),
					binElem = bin.elem,
					binBounds = binElem.getBoundingClientRect(),
					binBackElem = bin.backElem;

		binBackElem.classList.add("open");
		binElem.classList.add("open");
		itemElem.classList.remove("dropping");
		itemElem.classList.add("returning");
		setTimeout(function() {
			itemElem.classList.remove("returning");
		}, 600);

	
	}

	fixTooltip() {
		const elem = this.elem,
					windowWidth = window.innerWidth,
					tooltip = this.tooltip,
					tooltipBounds = tooltip.getBoundingClientRect(),
					tooltipInner = elem.querySelector(".tooltip-inner"),
					image = this.image,
					imageBounds = image.getBoundingClientRect(),
					margin = 0;


		let newLeft = 0;

		if(tooltipBounds.left <= windowWidth/2) {
			const leftEdge = -1*tooltipBounds.left + margin;
			if(leftEdge > 0) {
				newLeft = leftEdge;
			} 
		} else {
			const rightEdge = window.innerWidth - (tooltipBounds.x + tooltipBounds.width) - margin;
			if(rightEdge <= 0) {
				newLeft = rightEdge;
			}
		}
		tooltipInner.style.left = newLeft+"px";
	}
}

/************************************/
/*****************BIN****************/
/************************************/

class Bin {
	constructor(elem) {
		const self = this;
		this.elem = elem;
		this.stream = elem.dataset.stream;
		this.backElem = body.querySelector("#bin-backs [data-stream='"+this.stream+"']");
		$(elem).droppable({
		  over: this.onOverBin.bind(this),
		  out: this.onOutBin.bind(this),
		  drop: this.onDropBin.bind(this),
		});
	}

	onOverBin(e, ui) {
		const self = this,
					binElem = e.target,
					stream = binElem.dataset.stream,
					binBackElem = this.backElem,
					itemElem = ui.draggable[0],
					itemSlug = itemElem.dataset.item,
					item = itemsArr[itemElem.dataset.item];
		binElem.classList.add("open");
		binBackElem.classList.add("open");
		itemElem.classList.add("opening");
	}

	onOutBin(e, ui) {
		const self = this,
					binElem = e.target,
					stream = binElem.dataset.stream,
					binBackElem = this.backElem,
					itemElem = ui.draggable[0],
					itemSlug = itemElem.dataset.item,
					item = itemsArr[itemElem.dataset.item];
		binElem.classList.remove("open");
		binBackElem.classList.remove("open");
		itemElem.classList.remove("opening");
	}

	onDropBin(e, ui) {
		const self = this,
					itemsWrapBounds = itemsWrap.getBoundingClientRect(),
					binElem = e.target,
					binBounds = binElem.getBoundingClientRect(),
					binSlug = binElem.dataset.stream,
					binStreamArr = binSlug.split("-"),
					binTitle = binElem.dataset.title,
					binBackElem = this.backElem,
					itemElem = ui.draggable[0],
					itemSlug = itemElem.dataset.item,
					itemBounds = itemElem.getBoundingClientRect(),
					newItemLeft = binBounds.left + binBounds.width/2 - itemBounds.width/2 - itemsWrapBounds.left,
					itemObj = itemsArr[itemElem.dataset.item],
					itemOrigin = JSON.parse(itemElem.dataset.origin),
					itemStreamSlug = itemElem.dataset.stream;

		window.streamSlug = binSlug;

		itemElem.classList.remove("opening");
		itemElem.classList.add("centering");
		itemElem.style.left = newItemLeft+"px";
		setTimeout(function() {
			itemElem.classList.remove("centering");
			itemElem.classList.add("dropping");
		}, 100);

		setTimeout(function() {
			binElem.classList.remove("open");
			binBackElem.classList.remove("open");
		}, 350);

		if(binStreamArr.includes(itemStreamSlug)) {
			const streamObj = window.streams[itemStreamSlug];
			showAlert("correct-bin", function() {
				streamObj.startStreaming();
			});
		} else {
			setTimeout(function() {
				itemObj.returnItem(self);
			}, 400);
			if(itemStreamSlug == "landfill") {
				showAlert("not-recycle", function() {
					itemsWrapPackery.layout();
					binElem.classList.remove("open");
					binBackElem.classList.remove("open");
				});
			}  else if(!binStreamArr.includes("landfill")) {
				showAlert("wrong-recycle", function() {
					itemsWrapPackery.layout();
					binElem.classList.remove("open");
					binBackElem.classList.remove("open");
				});
			} else {
				showAlert("not-trash", function() {
					itemsWrapPackery.layout();
					binElem.classList.remove("open");
					binBackElem.classList.remove("open");
				});
			}
		}
	}

}

/************************************/
/****************STREAM**************/
/************************************/

class Stream {

	constructor(elem) {
		const self = this;
		this.elem = elem;
		this.slug = elem.dataset.slug;
		this.scene = "garage" + (this.slug === "paper" ? "-paper" : "");
		this.scenes = {};
		this.scenesWrap = elem.querySelector(".scenes-wrap");
		this.progress = elem.querySelector(".progress");
	
		const prevArrow = elem.querySelector(".arrow[data-dir='prev']"),
					nextArrow = elem.querySelector(".arrow[data-dir='next']");

		prevArrow.onclick = () => {
			self.goToPrevScene();
		};
		nextArrow.onclick = () => {
			self.goToNextScene();
		};

		const toggleButton = elem.querySelector(".icon-button.toggle"),
					replayButton = elem.querySelector(".icon-button.replay"),
					volumeButton = elem.querySelector(".icon-button.volume");

		toggleButton.onclick = () => {
			body.classList.toggle("close-chyron");
		};

		replayButton.onclick = () => {
			const currSceneObj = self.scenes[self.scene],
						currCaptionElem = currSceneObj.caption,
						currAudioElem = currSceneObj.audio;
			body.classList.remove("mute");
			if(currAudioElem) {
				currAudioElem.currentTime = 0;
				currAudioElem.play();
			}
		};

		volumeButton.onclick = () => {
			const currSceneObj = self.scenes[self.scene],
						currCaptionElem = currSceneObj.caption,
						currAudioElem = currSceneObj.audio;
			
			body.classList.toggle("mute");
			if(currAudioElem) {
				if(body.classList.contains("mute")) {
					currAudioElem.pause();
				} else {
					currAudioElem.play();
				}
			}
		};

		this.setUpScenes();
		window.streams[this.slug] = this;
	}

	setUpScenes() {
		const self = this,
					sceneElems = this.elem.querySelectorAll(".scene:not(.setup)"),
					animatedScenes = ["garage-paper", "weighing"],
					svgReqs = [];

		sceneElems.forEach(function(sceneElem, i) {
			const slug = sceneElem.dataset.scene,
						sceneObj = new Scene(sceneElem, self.elem);
			scenesArr[slug] = sceneObj
			self.scenes[slug] = sceneObj;
			if(sceneObj.req) {
				svgReqs.push(sceneObj.req);
			}
		});

		Promise.all(svgReqs).then(responses => {
			startButtn.onclick = () => {
				body.id = "pre-select";
				handleStreamSelect();
				showAlert("select", () => {
					body.id = "select";
				});
			}
			introView.classList.remove("loading");
		});
	}

	startStreaming() {
		const self = this,
					currStreamElem = body.querySelector(".stream.show"),
					currSceneElem = body.querySelector(".scene.show"),
					droppingItemElem = body.querySelector(".item.dropping")

		if(currStreamElem) currStreamElem.classList.remove("show");
		if(currSceneElem) currSceneElem.classList.remove("show");

		droppingItemElem.classList.remove("dropping");

		this.elem.classList.remove("exit");
		this.elem.classList.add("show");
		body.id = "streams";
		this.goToScene(this.scene);
		currStream = this;
	}

	prepareScene(sceneSlug) {
		const sceneObj = this.scenes[sceneSlug];
		if(!sceneObj) return;
		const sceneColor = sceneObj.color,
					tickElem = sceneObj.tick,
					captionElem = sceneObj.caption,
					sceneElem = sceneObj.elem,
					audioElem = sceneObj.audio;
		audioElem.load();
		audioElem.currentTime = 0;
		audioElem.pause();
		tickElem.classList.add("active");
		captionElem.classList.add("show");
		sceneElem.classList.add("show", "animate");
		streamsView.dataset.color = sceneColor;
		// sceneObj.animateScene();
	}

	goToScene(sceneSlug) {
		if(body.id != "streams") return;
		
		const nextSceneObj = this.scenes[sceneSlug],
					nextSceneElem = nextSceneObj.elem,
					nextAudioElem = nextSceneObj.audio,
					currSceneElem = this.scenesWrap.querySelector(".scene.show"),
					currTickElem = this.elem.querySelector(".tick.active"),
					currCaptionElem = this.elem.querySelector(".caption.show"),
					playingAudioElem = currCaptionElem ? currCaptionElem.querySelector("audio") : null;

		if(currSceneElem) {
			currSceneElem.classList.remove("show");
			setTimeout(function() {
				currSceneElem.classList.remove("animate");
			}, 1000);
		}
		if(currTickElem) {
			currTickElem.classList.remove("active");
		}
		if(currCaptionElem) {
			currCaptionElem.classList.remove("show");
			currCaptionElem.classList.remove("playing");
		}
		if(playingAudioElem) {
			playingAudioElem.currentTime = 0;
			playingAudioElem.pause();
		}

		if(nextSceneObj.animation) {
			nextSceneObj.animation.goToAndPlay(0);
		}

		nextSceneElem.classList.add("show");
		if(!nextSceneElem)
			return body.id = "";
		const nextSceneSlug = nextSceneElem.dataset.scene;
		this.scene = nextSceneSlug;
		this.prepareScene(nextSceneSlug);

		if(nextAudioElem && !body.classList.contains("mute")) {
			setTimeout(function() {
				nextAudioElem.play();
			}, 500);
		}
	}

	goToNextScene() {
		const currSceneSlug = this.scene,
					currElem = this.elem.querySelector("[data-scene='"+currSceneSlug+"']"),
					nextElem = currElem.nextSibling;
		if(nextElem) {
			const nextSlug = nextElem.dataset.scene;
			this.goToScene(nextSlug);
		}
	}

	goToPrevScene() {
		const currSceneSlug = this.scene,
					currElem = this.elem.querySelector("[data-scene='"+currSceneSlug+"']"),
					prevElem = currElem.previousSibling;

		if(prevElem) {
			const prevSlug = prevElem.dataset.scene;
			this.goToScene(prevSlug);
		} else {
			const playingAudioElem = this.elem.querySelector(".playing audio");
			if(playingAudioElem) {
				playingAudioElem.pause();
				playingAudioElem.currentTime = 0;
			}
			body.id = "pre-select";
			handleStreamSelect();
		}
	}
}


class Scene {

	constructor(sceneElem, streamElem) {
		const self = this;

		this.elem = sceneElem;
		this.slug = sceneElem.dataset.scene;
		this.parent = streamElem;
		this.stream = streamElem.dataset.slug;
		this.color = sceneElem.dataset.color;

		this.tick = streamElem.querySelector(".tick[data-scene='"+this.slug+"']");
		this.caption = streamElem.querySelector(".caption[data-scene='"+this.slug+"']");
		this.audio = this.caption ? this.caption.querySelector("audio") : null;
		this.tooltip = sceneElem.querySelector(".tooltip");

		if(sceneElem.dataset.animated == "true") {
			this.getAnimation();
		} else {
			this.getSvg();
		}
	}

	getAnimation() {
		const loop = this.elem.dataset.loop == "true";
		const animation = lottie.loadAnimation({
			container: this.elem.querySelector(".svg-wrap"),
			renderer: 'svg',
			loop: loop,
			autoplay: false,
			path: "assets/animate/"+this.slug+"/"+this.slug+".json"
		});
		this.animation = animation;
		this.setUpScene();
	}

	getSvg() {
		const self = this;
		let req = null;
		if(this.stream == "paper", "landfill") {
			req = fetch(rootPath+"assets/scenes/"+this.slug+"/scene.svg")
				.then(response => {
					if (!response.ok) {
						throw new Error(self.slug+' scene is not found');
					} else {
						return response.text();
					}
				})
			  .then(svg => {
			  	self.elem.classList.add("setup");
			  	const sceneSvgWrap = self.elem.querySelector(".svg-wrap");
			  	if(!sceneSvgWrap) return;
			  	sceneSvgWrap.insertAdjacentHTML("afterbegin", svg);
			  	self.setUpScene(self.elem);
			  	return svg;
			  });
		} else {
			this.elem.classList.add("setup");
	  	this.setUpScene();
		}
		this.req = req;
	}

	setUpScene() {
		const self = this,
					slug = this.slug,
					color = this.color,
					sceneElem = this.elem,
					tickElem = this.tick,
					captionElem = this.caption,
					audioElem = this.audio,
					tooltipElem = this.tooltip,
					markerElem = sceneElem.querySelector(".marker");
		this.marker = markerElem;

		if(tickElem) {
			tickElem.onclick = () => {
				const stream = streamsArr[self.stream];
				stream.goToScene(slug);
			};
		}
		if(audioElem && captionElem) {
			audioElem.onplay = () => {
				captionElem.classList.add("playing");
			};
			audioElem.onpause = () => {
				captionElem.classList.remove("playing");
			};
			audioElem.onended = () => {
				captionElem.classList.remove("playing");
			};
		}

		if(markerElem) {
			self.fixTooltip();
			markerElem.onclick = (e) => {
				tooltipElem.classList.toggle("show");

				if(tooltipElem.classList.contains("show")) {
					self.fixTooltip();
				}

				gsap.to(markerElem, {
					rotation: tooltipElem.classList.contains("show") ? 45 : 0,
					duration: .2,
					transformOrigin: "center center"
				});
			};
		}
	}

	fixTooltip() {
		const windowWidth = window.innerWidth,
					markerElem = this.marker,
					markerBounds = markerElem.getBoundingClientRect(),
					tooltipElem = this.tooltip,
					tooltipBounds = tooltipElem.getBoundingClientRect(),
					tooltipInner = tooltipElem.querySelector(".tooltip-inner"),
					margin = 20,
					newTop = markerBounds.y + 5;
		let newLeft;

		if(windowWidth >= markerBounds.x + 450) {
			newLeft = markerBounds.x + markerBounds.width;
			tooltipElem.classList.remove("left");
			tooltipElem.classList.add("right");
		} else {
			newLeft = markerBounds.x - tooltipBounds.width;
			tooltipElem.classList.remove("right");
			tooltipElem.classList.add("left");
		}

		tooltipElem.style.left = newLeft+"px";
		tooltipElem.style.top = newTop+"px";
		
	}

	// animateScene() {
	// 	const sceneElem = this.elem,
	// 				sceneAnim = animations[this.slug];
	// 	if(sceneAnim && !sceneElem.classList.contains("animating")) {
	// 		sceneElem.classList.add("animating");
	// 		setTimeout(function() {
	// 			sceneAnim(sceneElem);
	// 		}, 100);
	// 	}
	// }

}
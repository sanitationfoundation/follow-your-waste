import "./src/sass/style.scss";
// import "./src/js/script.js";

import lottie from "lottie-web";
import Packery from "packery";
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/droppable";

export const onClientEntry = () => {
	window.onload = () => {
		const body = document.querySelector("body"),
					docElem = document.documentElement,
					introView = document.querySelector("#intro-view"),
					startButtn = document.querySelector("#intro-button"),
					selectView = document.querySelector("#select-view"),
					streamsView = document.querySelector("#streams-view"),
					streamElems = document.querySelectorAll(".stream"),
					itemsWrap = document.querySelector("#items-wrap"),
					itemElems = document.querySelectorAll(".item"),
					itemsArr = [],
					scenesArr = [],
					streamsArr = [];

		let itemsWrapPackery, currStream;

		const streams = {
			landfill: "Landfill",
			paper: "Paper",
			metal: "Metal",
			glass: "Glass",
			plastic: "Plastic"
		};

		window.onresize = () => {
			scenesArr.forEach((sceneObj) => {
				if(sceneObj.marker) {
					sceneObj.fixTooltip();
				}
			});
			if(body.id === "select" && itemsWrap.classList.contains("setup")) {
				itemsWrapPackery.layout();
			}
		};

		document.onkeydown = (e) => {
			e = e || window.event;
			const keyCode = e.keyCode ? e.keyCode : e.which;

			switch (keyCode) {
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
					const currVoiceAudioElem = currStream.elem.querySelector(".caption.show audio");
					body.classList.toggle("mute");
					if(body.classList.contains("mute")) {
						pauseAudio(currVoiceAudioElem);
					} else {
						playAudio(currVoiceAudioElem);
					}
					break;
				default:
					break;
			}
		};

		document.onfullscreenchange = (e) => {
			if(document.fullscreenElement) {
				body.classList.add("full");
			} else {
				body.classList.remove("full");
			}
		};

		const toggleFullscreen = (e) => {
			body.classList.toggle("full");
			if(body.classList.contains("full")) {
				openFullscreen();
			} else {
				closeFullscreen();
			}
		};

		const openFullscreen = (e) => {
			if(docElem.requestFullscreen && !document.fullscreenElement) {
				docElem.requestFullscreen();
			}
		};

		const closeFullscreen = (e) => {
			if(document.exitFullscreen && document.fullscreenElement) {
				document.exitFullscreen();
			}
		};

		const isIframe = (e) => {
			try {
				return window.self !== window.top;
			} catch (e) {
				return true;
			}
		};

		const fadeInDur = {
			voice: 50,
			environ: 1000
		}

		const fadeOutDur = {
			voice: 500,
			environ: 1000
		}

		const volMax = {
			voice: .5,
			environ: 1
		}

		const playAudio = (elem) => {
			if(body.classList.contains("mute")) return;
			const type = elem.dataset.type;
			$(elem).prop("volume", 0);
			elem.play();
			$(elem).animate({
				volume: volMax[type]
			}, fadeInDur[type]);
		};

		const pauseAudio = (elem) => {
			const type = elem.dataset.type;
			$(elem).animate({
				volume: 0
			}, fadeOutDur[type], (e) => {
				elem.pause();
				if(type === "voice") {
					elem.currentTime = 0;	
				}
			});
		};

		/************************************/
		/************STREAM SELECT***********/
		/************************************/

		const setUpStreamSelect = () => {
			itemElems.forEach(function (itemElem) {
				const slug = itemElem.dataset.item,
					itemObj = new Item(itemElem);
				itemsArr[slug] = itemObj;
			});

			streamElems.forEach(function (streamElem) {
				const slug = streamElem.dataset.slug,
					streamObj = new Stream(streamElem);
				streamsArr[slug] = streamObj;
			});
		};

		const handleStreamSelect = () => {
			itemsWrapPackery = new Packery(itemsWrap, {
				itemSelector: ".item",
				transitionDuration: 200,
				resize: true,
				gutter: 40,
			});
			itemsWrap.classList.add("setup");

			const binElems = selectView.querySelectorAll("#bins .bin");
			binElems.forEach(function (binElem, i) {
				new Bin(binElem);
			});
		};

		const showAlert = (alertSlug, onClick) => {
			body.classList.add("alerts");
			const alertElem = document.querySelector(
					"[data-alert='" + alertSlug + "']"
				),
				buttonElem = alertElem.querySelector(".button");
			alertElem.classList.add("show");
			buttonElem.onclick = (e) => {
				alertElem.classList.remove("show");
				body.classList.remove("alerts");
				if(onClick) {
					onClick();
				}
			};
		};

		/************************************/
		/*****************ITEM***************/
		/************************************/

		class Item {
			constructor(elem) {
				const self = this;
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
			}

			onStartDragItem(e, ui) {
				const itemElem = e.target;
				if(itemElem.dataset.origin === undefined) {
					const origin = [ui.originalPosition.left, ui.originalPosition.top];
					itemElem.dataset.origin = JSON.stringify(origin);
				}
				body.classList.add("dragging");
			}

			onStopDragItem(e, ui) {
				body.classList.remove("dragging");
			}

			onDragItem(e, ui) {
				// const itemElem = e.target,
				// 			itemHeight = itemElem.clientHeight,
				// 			itemTop = ui.position.top,
				// 			itemBottom = itemHeight + itemTop;
				this.fixTooltip();
			}

			returnItem(bin) {
				const itemElem = this.elem,
					binElem = bin.elem,
					binBackElem = bin.backElem;

				binBackElem.classList.add("open");
				binElem.classList.add("open");
				itemElem.classList.remove("dropping");
				itemElem.classList.add("returning");
				setTimeout(function () {
					itemElem.classList.remove("returning");
				}, 600);
			}

			fixTooltip() {
				const elem = this.elem,
					windowWidth = window.innerWidth,
					tooltip = this.tooltip,
					tooltipBounds = tooltip.getBoundingClientRect(),
					tooltipInner = elem.querySelector(".tooltip-inner"),
					margin = 0;

				let newLeft = 0;

				if(tooltipBounds.left <= windowWidth / 2) {
					const leftEdge = -1 * tooltipBounds.left + margin;
					if(leftEdge > 0) {
						newLeft = leftEdge;
					}
				} else {
					const rightEdge =
						window.innerWidth -
						(tooltipBounds.x + tooltipBounds.width) -
						margin;
					if(rightEdge <= 0) {
						newLeft = rightEdge;
					}
				}
				tooltipInner.style.left = newLeft + "px";
			}
		}

		/************************************/
		/*****************BIN****************/
		/************************************/

		class Bin {
			constructor(elem) {
				this.elem = elem;
				this.stream = elem.dataset.stream;
				this.backElem = body.querySelector(
					"#bin-backs [data-stream='" + this.stream + "']"
				);
				$(elem).droppable({
					over: this.onOverBin.bind(this),
					out: this.onOutBin.bind(this),
					drop: this.onDropBin.bind(this),
				});
			}

			onOverBin(e, ui) {
				const binElem = e.target,
					binBackElem = this.backElem,
					itemElem = ui.draggable[0];
				binElem.classList.add("open");
				binBackElem.classList.add("open");
				itemElem.classList.add("opening");
			}

			onOutBin(e, ui) {
				const binElem = e.target,
					binBackElem = this.backElem,
					itemElem = ui.draggable[0];
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
					binBackElem = this.backElem,
					itemElem = ui.draggable[0],
					itemBounds = itemElem.getBoundingClientRect(),
					newItemLeft =
						binBounds.left +
						binBounds.width / 2 -
						itemBounds.width / 2 -
						itemsWrapBounds.left,
					itemObj = itemsArr[itemElem.dataset.item],
					itemStreamSlug = itemElem.dataset.stream;

				itemElem.classList.remove("opening");
				itemElem.classList.add("centering");
				itemElem.style.left = newItemLeft + "px";
				setTimeout(function () {
					itemElem.classList.remove("centering");
					itemElem.classList.add("dropping");
				}, 100);

				setTimeout(function () {
					binElem.classList.remove("open");
					binBackElem.classList.remove("open");
				}, 350);

				if(binStreamArr.includes(itemStreamSlug)) {
					const streamObj = streams[itemStreamSlug];
					showAlert("correct-bin", function () {
						streamObj.startStreaming();
					});
				} else {
					setTimeout(function () {
						itemObj.returnItem(self);
					}, 400);
					if(itemStreamSlug === "landfill") {
						showAlert("not-recycle", function () {
							itemsWrapPackery.layout();
							binElem.classList.remove("open");
							binBackElem.classList.remove("open");
						});
					} else if(!binStreamArr.includes("landfill")) {
						showAlert("wrong-recycle", function () {
							itemsWrapPackery.layout();
							binElem.classList.remove("open");
							binBackElem.classList.remove("open");
						});
					} else {
						showAlert("not-trash", function () {
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

				const volumeButton = elem.querySelector(".icon-button.volume"),
							replayButton = elem.querySelector(".icon-button.replay");

				volumeButton.onclick = () => {
					const currSceneObj = self.scenes[self.scene],
								currVoiceAudioElem = currSceneObj.voiceover,
								currEnvironAudioElem = currSceneObj.environ;
					body.classList.toggle("mute");
					if(currVoiceAudioElem) {
						if(body.classList.contains("mute")) {
							pauseAudio(currVoiceAudioElem);
							pauseAudio(currEnvironAudioElem);
						} else {
							playAudio(currVoiceAudioElem);
							playAudio(currEnvironAudioElem);
						}
					}
				};

				replayButton.onclick = () => {
					const currSceneObj = self.scenes[self.scene],
								currVoiceAudioElem = currSceneObj.voiceover;
					body.classList.remove("mute");
					if(currVoiceAudioElem) {
						currVoiceAudioElem.currentTime = 0;
						playAudio(currVoiceAudioElem);
					}
				};

				this.setUpScenes();
				streams[this.slug] = this;
			}

			setUpScenes() {
				const self = this,
							sceneElems = this.elem.querySelectorAll(".scene:not(.setup)"),
							svgReqs = [];
				sceneElems.forEach(function (sceneElem, i) {
					const slug = sceneElem.dataset.scene,
								sceneObj = new Scene(sceneElem, self.elem);
					scenesArr[slug] = sceneObj;
					self.scenes[slug] = sceneObj;
					if(sceneObj.req) {
						svgReqs.push(sceneObj.req);
					}
				});

				Promise.all(svgReqs).then((responses) => {
					startButtn.onclick = () => {
						body.id = "pre-select";
						handleStreamSelect();
						showAlert("select", () => {
							body.id = "select";
						});
					};
					introView.classList.remove("loading");
				});
			}

			startStreaming() {
				const currStreamElem = body.querySelector(".stream.show"),
							currSceneElem = body.querySelector(".scene.show"),
							droppingItemElem = body.querySelector(".item.dropping");

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
							voiceAudioElem = sceneObj.voiceover;
				if(voiceAudioElem) {
					voiceAudioElem.load();
					// pauseAudio(voiceAudioElem);
				}
				if(captionElem) {
					captionElem.classList.add("show");
				}
				tickElem.classList.add("active");
				sceneElem.classList.add("show", "animate");
				streamsView.dataset.color = sceneColor;
			}

			goToScene(nextSceneSlug) {
				if(body.id !== "streams") return;
				const nextSceneObj = this.scenes[nextSceneSlug],
							nextSceneElem = nextSceneObj.elem,
							nextVoiceAudioElem = nextSceneObj.voiceover,
							currSceneElem = this.scenesWrap.querySelector(".scene.show"),
							currTickElem = this.elem.querySelector(".tick.active"),
							currCaptionElem = this.elem.querySelector(".caption.show"),
							currVoiceAudioElem = currCaptionElem ? currCaptionElem.querySelector("audio") : null;
				let currEnviron;

				if(currSceneElem) {
					currSceneElem.classList.remove("show");
					setTimeout(function () {
						currSceneElem.classList.remove("animate");
					}, 1000);
					currEnviron = currSceneElem.dataset.environ;
				}
				if(currTickElem) {
					currTickElem.classList.remove("active");
				}
				if(currCaptionElem) {
					currCaptionElem.classList.remove("show");
					currCaptionElem.classList.remove("playing");
				}
				if(currVoiceAudioElem) {
					pauseAudio(currVoiceAudioElem);
				}

				if(nextSceneObj.animation) {
					nextSceneObj.animation.goToAndPlay(0);
				}

				if(!nextSceneElem.nextSibling) {
					this.elem.classList.add("end");
				} else {
					this.elem.classList.remove("end");
				}

				nextSceneElem.classList.add("show");
				if(!nextSceneElem) return (body.id = "");

				const nextEnviron = nextSceneElem.dataset.environ;
				this.scene = nextSceneSlug;
				this.prepareScene(nextSceneSlug);

				if(nextVoiceAudioElem) {
					setTimeout(function() {
						playAudio(nextVoiceAudioElem);
					}, 500);
				}

				const nextEnvironAudioElem = nextSceneObj.environ;
				if(!currEnviron) {
					playAudio(nextEnvironAudioElem);
					return;
				}

				const currSceneSlug = currSceneElem.dataset.scene,
							currSceneObj = this.scenes[currSceneSlug],
							currEnvironAudioElem = currSceneObj.environ;
				if(!nextEnviron) {
					pauseAudio(currEnvironAudioElem);
				} else if(currEnviron !== nextEnviron) {
					pauseAudio(currEnvironAudioElem);
					playAudio(nextEnvironAudioElem);
				}
			}

			goToNextScene() {
				const currSceneSlug = this.scene,
							currElem = this.elem.querySelector("[data-scene='" + currSceneSlug + "']"),
							nextElem = currElem.nextSibling;
				if(nextElem) {
					const nextSlug = nextElem.dataset.scene;
					this.goToScene(nextSlug);
				}
			}

			goToPrevScene() {
				const currSceneSlug = this.scene,
							currElem = this.elem.querySelector("[data-scene='" + currSceneSlug + "']"),
							prevElem = currElem.previousSibling;

				if(prevElem) {
					const prevSlug = prevElem.dataset.scene;
					this.goToScene(prevSlug);
				} else {
					const currSceneObj = this.scenes[this.scene],
								currVoiceAudioElem = currSceneObj.voiceover,
								currEnvironAudioElem = currSceneObj.environ;
					if(currVoiceAudioElem) {
						pauseAudio(currVoiceAudioElem);
					}
					if(currEnvironAudioElem) {
						pauseAudio(currEnvironAudioElem);
					}
					body.id = "pre-select";
					handleStreamSelect();
				}
			}
		}

		class Scene {
			constructor(sceneElem, streamElem) {
				this.elem = sceneElem;
				this.slug = sceneElem.dataset.scene;
				this.parent = streamElem;
				this.stream = streamElem.dataset.slug;
				this.color = sceneElem.dataset.color;

				this.tick = streamElem.querySelector(
					".tick[data-scene='" + this.slug + "']"
				);
				this.caption = streamElem.querySelector(
					".caption[data-scene='" + this.slug + "']"
				);

				const environ = sceneElem.dataset.environ;
				this.environ = document.querySelector("audio[data-environ="+environ+"]");
				this.voiceover = this.caption ? this.caption.querySelector("audio") : null;
				this.tooltip = sceneElem.querySelector(".tooltip");
				this.factoids = sceneElem.querySelectorAll(".factoid");

				if(sceneElem.dataset.animated === "true") {
					this.getAnimation();
				} else {
					this.getSvg();
				}
			}

			getAnimation() {
				const looped = this.elem.dataset.looped === "true";
				const animation = lottie.loadAnimation({
					container: this.elem.querySelector(".svg-wrap"),
					renderer: "svg",
					loop: looped,
					autoplay: false,
					path: this.elem.dataset.src
				});
				this.animation = animation;
				this.setUpScene();
			}

			getSvg() {
				const self = this;
				let req = null;
				if(["landfill", "paper", "plastic"].includes(this.stream)) {
					req = fetch(this.elem.dataset.src)
						.then((response) => {
							if(!response.ok) {
								throw new Error(self.slug + " scene is not found");
							} else {
								return response.text();
							}
						})
						.then((svg) => {
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
							sceneElem = this.elem,
							tickElem = this.tick,
							captionElem = this.caption,
							voiceAudioElem = this.voiceover,
							tooltipElem = this.tooltip,
							markerElem = sceneElem.querySelector(".marker"),
							factoidElems = this.factoids;
				this.marker = markerElem;

				if(tickElem) {
					tickElem.onclick = () => {
						const stream = streamsArr[self.stream];
						stream.goToScene(slug);
					};
				}
				if(voiceAudioElem && captionElem) {
					voiceAudioElem.onplay = () => {
						captionElem.classList.add("playing");
					};
					voiceAudioElem.onpause = () => {
						captionElem.classList.remove("playing");
					};
					voiceAudioElem.onended = () => {
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
					};
				}

				factoidElems.forEach((factoidElem) => {
					factoidElem.onclick = (e) => {
						factoidElem.classList.toggle("open");
					};

					const vocab = factoidElem.dataset.vocab;
					if(vocab) {
						const captionTextElem = captionElem.querySelector(".text"),
							captionText = captionTextElem.innerHTML,
							newCaptionText = captionText.replace(
								vocab,
								`<span class="vocab clickable">${vocab}</span>`
							);
						captionTextElem.innerHTML = newCaptionText;
					}
				});

				if(captionElem) {
					const vocabElems = captionElem.querySelectorAll(".vocab.clickable");
					vocabElems.forEach((vocabElem) => {
						const vocabStr = vocabElem.innerText,
							factoidElem = sceneElem.querySelector(
								`[data-vocab="${vocabStr}"]`
							);
						vocabElem.onclick = (e) => {
							factoidElem.classList.toggle("open");
						};
					});
				}
			}

			fixTooltip() {
				const windowWidth = window.innerWidth,
					markerElem = this.marker,
					markerBounds = markerElem.getBoundingClientRect(),
					tooltipElem = this.tooltip,
					tooltipBounds = tooltipElem.getBoundingClientRect(),
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

				tooltipElem.style.left = newLeft + "px";
				tooltipElem.style.top = newTop + "px";
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

		setUpStreamSelect();

		const fullToggle = document.querySelector("#full-toggle");
		fullToggle.onclick = toggleFullscreen;

		if(isIframe()) {
			body.classList.add("full");
		}
	};
};

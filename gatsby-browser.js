import "./src/sass/style.scss";
import lottie from "lottie-web";
import Packery from "packery";
import $ from "jquery";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

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
					binElems = selectView.querySelectorAll("#bins .bin"),
					selectMenuButtons = document.querySelectorAll("#select-menu button"),
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

		body.classList.add("loaded");

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
			let currSceneElem, currEnviron, currVoiceAudioElem, currEnvironAudioElem;
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
				case 32:
					currSceneElem = document.querySelector(".stream.show .scene.show");
					if(!currSceneElem) return;
					currEnviron = currSceneElem.dataset.environ;
					currVoiceAudioElem = currStream.elem.querySelector(".caption.show audio");
					currEnvironAudioElem = document.querySelector(`audio[data-environ="${currEnviron}"]`);
					body.classList.toggle("playing");
					if(body.classList.contains("playing")) {
						body.classList.remove("mute");
						playAudio(currVoiceAudioElem);
						unmuteAudio(currVoiceAudioElem);
						unmuteAudio(currEnvironAudioElem);
					} else {
						pauseAudio(currVoiceAudioElem);
					}
					break;
				case 77:
					currSceneElem = document.querySelector(".stream.show .scene.show");
					if(!currSceneElem) return;
					currEnviron = currSceneElem.dataset.environ;
					currVoiceAudioElem = currStream.elem.querySelector(".caption.show audio");
					currEnvironAudioElem = document.querySelector(`audio[data-environ="${currEnviron}"]`);
					body.classList.toggle("mute");
					if(body.classList.contains("mute")) {
						muteAudio(currVoiceAudioElem);
						muteAudio(currEnvironAudioElem);
					} else {
						unmuteAudio(currVoiceAudioElem);
						unmuteAudio(currEnvironAudioElem);
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
			voice: 1,
			environ: .75
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
			$(elem).animate({
				volume: 0
			}, 100, (e) => {
				elem.pause();
			});
		};

		const muteAudio = (elem) => {
			const type = elem.dataset.type;
			$(elem).animate({
				volume: 0
			}, fadeOutDur[type]);
		};

		const unmuteAudio = (elem) => {
			if(body.classList.contains("mute")) return;
			const type = elem.dataset.type;
			$(elem).animate({
				volume: volMax[type]
			}, fadeInDur[type]);
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

			selectMenuButtons.forEach(function (buttonElem) {
				buttonElem.onclick = (e) => {
					const streamSlug = buttonElem.dataset.stream,
								streamObj = streams[streamSlug];
					body.classList.remove("alerts");
					streamObj.startStreaming();
				};
			});
		};

		const handleStreamSelect = () => {
			itemsWrapPackery = new Packery(itemsWrap, {
				itemSelector: ".item",
				transitionDuration: 200,
				resize: true,
				gutter: 40,
			});

			itemsWrapPackery.on( 'layoutComplete', () => {
				itemElems.forEach((itemElem) => {
					const itemSlug = itemElem.dataset.item,
								itemBounds = itemElem.getBoundingClientRect(),
								itemObj = itemsArr[itemSlug];
					itemObj.left = itemBounds.left;
					itemObj.top = itemBounds.top;
					gsap.set(itemElem, {
						x: 0,
						y: 0
					});
				});
			});

			itemsWrapPackery.layout();
			
			itemsWrap.classList.add("setup");
		};

		const showAlert = (alertSlug, onClick) => {
			body.classList.add("alerts");
			const alertElem = document.querySelector("[data-alert='" + alertSlug + "']"),
						buttonElem = alertElem.querySelector(".button");
			alertElem.classList.add("show");			
			buttonElem.onclick = (e) => {
				alertElem.classList.remove("show");
				body.classList.remove("alerts");
				if(onClick) {
					onClick(e);
				}
			};
			
			var menuElem = alertElem.querySelector(`[role="menu"]`);
			if(menuElem) {
				menuElem.focus();
			} else {
				buttonElem.focus();
			}
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
				this.left = 0;
				this.top = 0;

				this.draggable = Draggable.create(elem, {
					bounds: window,
					onDragStart: self.onDragStart.bind(self),
					onDrag: self.onDrag.bind(self),
					onDragEnd: self.onDragEnd.bind(self)
				})[0];

				elem.onmouseover = () => {
					elem.classList.add("hovering");
					self.fixTooltip();
				};

				elem.onmouseleave = () => {
					elem.classList.remove("hovering");
				};
			}

			onDragStart(e) {
				body.classList.add("dragging");
			}

			onDrag(e) {
				const self = this,
							itemElem = this.elem;
				this.fixTooltip();
				binElems.forEach((binElem) => {
					const isOver = Draggable.hitTest(itemElem, binElem, 50);
					if(isOver) {
						self.hoverBin(binElem);
					} else {
						self.unhoverBin(binElem);
					}
				});
				this.fixTooltip();
			}

			onDragEnd(e) {
				const self = this,
							itemElem = this.elem;
				binElems.forEach((binElem) => {
					const isOver = Draggable.hitTest(itemElem, binElem, 50);
					if(isOver) {
						self.dropInBin(binElem);
					} else {
						self.unhoverBin(binElem);
					}
				});
				itemElem.classList.remove("hovering");
				body.classList.remove("dragging");
				this.fixTooltip();
			}

			hoverBin(binElem) {
				const binSlug = binElem.dataset.bin,
							binBackElem = body.querySelector(`#${binSlug}-back`),
							itemElem = this.elem;
				binElem.classList.add("open");
				binBackElem.classList.add("open");
				itemElem.classList.add("opening");
			}

			unhoverBin(binElem) {
				const binSlug = binElem.dataset.bin,
							binBackElem = body.querySelector(`#${binSlug}-back`),
							itemElem = this.elem;
				binElem.classList.remove("open");
				binBackElem.classList.remove("open");
				itemElem.classList.remove("opening");
			}

			dropInBin(binElem) {
				const self = this,
							binBounds = binElem.getBoundingClientRect(),
							binSlug = binElem.dataset.bin,
							binStreamArr = binSlug.split("-"),
							binBackElem = body.querySelector(`#${binSlug}-back`),
							itemElem = this.elem,
							itemBounds = itemElem.getBoundingClientRect(),
							newItemLeft =
								-this.left
								+ binBounds.left
								+ ( binBounds.width/2 )
								- ( itemBounds.width/2 ),
							newItemTop =
								this.top
								+ window.innerHeight,
							itemStreamSlug = itemElem.dataset.stream;

				binElem.classList.add("open");
				itemElem.classList.add("dropping");
				itemElem.classList.remove("opening");

				gsap.timeline()
					.to(itemElem, {
						x: newItemLeft,
						duration: .25
					})
					.to(itemElem, {
						y: newItemTop,
						duration: 1.5
					});
				

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
						self.returnItem(binElem);
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

			returnItem(binElem) {
				const itemElem = this.elem,
							binSlug = binElem.dataset.bin,
							binBackElem = body.querySelector(`#${binSlug}-back`);

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
				this.volumeButton = elem.querySelector(".icon-button.volume");
				this.playbackButton = elem.querySelector(".icon-button.playback");
				this.prevArrow = elem.querySelector(".arrow[data-dir='prev']");
				this.nextArrow = elem.querySelector(".arrow[data-dir='next']");

				this.prevArrow.onclick = () => {
					self.goToPrevScene();
				};
				this.nextArrow.onclick = () => {
					self.goToNextScene();
				};

				this.volumeButton.onclick = () => {
					const currSceneObj = self.scenes[self.scene],
								currVoiceAudioElem = currSceneObj.voiceover,
								currEnvironAudioElem = currSceneObj.environ;
					body.classList.toggle("mute");
					if(body.classList.contains("mute")) {
						muteAudio(currVoiceAudioElem);
						muteAudio(currEnvironAudioElem);
					} else {
						unmuteAudio(currVoiceAudioElem);
						unmuteAudio(currEnvironAudioElem);
					}
					self.volumeButton.blur();
				};

				this.playbackButton.onclick = (e) => {
					const currSceneObj = self.scenes[self.scene],
								currVoiceAudioElem = currSceneObj.voiceover,
								currEnvironAudioElem = currSceneObj.environ;
					body.classList.toggle("playing");
					if(body.classList.contains("playing")) {
						body.classList.remove("mute");
						playAudio(currVoiceAudioElem);
						unmuteAudio(currVoiceAudioElem);
						unmuteAudio(currEnvironAudioElem);
					} else {
						pauseAudio(currVoiceAudioElem);
					}
					self.playbackButton.blur();
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
					startButtn.setAttribute("aria-disabled", false);
					startButtn.onclick = () => {
						body.id = "pre-select";
						handleStreamSelect();
						showAlert("select", (e) => {
							body.id = "select";
						});
					};
					introView.classList.remove("loading");
				});
			}

			startStreaming() {
				const nextStreamElem = this.elem,
							currStreamElem = body.querySelector(".stream.show"),
							currSceneElem = body.querySelector(".scene.show"),
							droppingItemElem = body.querySelector(".item.dropping");

				if(currStreamElem) {
					currStreamElem.classList.remove("show");
					currStreamElem.setAttribute("aria-hidden", true);
				}
				if(currSceneElem) {
					currSceneElem.classList.remove("show");
				}
				if(droppingItemElem) {
					droppingItemElem.classList.remove("dropping");
				}

				nextStreamElem.classList.remove("exit");
				nextStreamElem.classList.add("show");
				nextStreamElem.setAttribute("aria-hidden", false);
				body.id = "streams";
				this.goToScene(this.scene);
				this.playbackButton.focus();
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
					currSceneElem.setAttribute("aria-hidden", true);
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
					body.classList.remove("playing");
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

				if(!nextSceneElem) return (body.id = "");
				nextSceneElem.classList.add("show");
				nextSceneElem.setAttribute("aria-hidden", false);

				const nextEnviron = nextSceneElem.dataset.environ;
				this.scene = nextSceneSlug;
				this.prepareScene(nextSceneSlug);

				if(nextVoiceAudioElem) {
					playAudio(nextVoiceAudioElem);
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
						body.classList.add("playing");
					};
					voiceAudioElem.onpause = () => {
						body.classList.remove("playing");
					};
					voiceAudioElem.onended = () => {
						body.classList.remove("playing");
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

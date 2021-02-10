import "./src/sass/style.scss";
import lottie from "lottie-web";
import $ from "jquery";
import { gsap, Draggable, CSSPlugin } from "gsap/all";
import Packery from "packery";

export const onInitialClientRender = () => {
	gsap.registerPlugin(Draggable, CSSPlugin);

	window.onload = () => {
		const body = document.querySelector("body"),
					docElem = document.documentElement,
					fullTog = document.querySelector("#full-toggle"),
					helpTog = document.querySelector("#help-toggle"),
					introView = document.querySelector("#intro-view"),
					introBttn = document.querySelector("#intro-button"),
					selectView = document.querySelector("#select-view"),
					itemsWrap = document.querySelector("#items-wrap"),
					itemElems = document.querySelectorAll(".item"),
					selectedItem = document.querySelector("#selected-item"),
					binElems = document.querySelectorAll("#bins .bin"),
					selectMenuBttns = document.querySelectorAll("#menu-select button"),
					streamsView = document.querySelector("#streams-view"),
					streamElems = document.querySelectorAll(".stream"),
					itemsArr = [],
					scenesArr = [],
					streamsArr = [];

		let itemsWrapPackery, currStreamObj, currSceneObj, streamIntrod;

		const streams = {
			landfill: "Landfill",
			paper: "Paper",
			metal: "Metal",
			glass: "Glass",
			plastic: "Plastic"
		};

		body.classList.add("loading");

		window.onresize = () => {
			scenesArr.forEach( (sceneObj) => {
				if(sceneObj.marker) {
					sceneObj.fixTooltip();
				}
			});
			if(body.id === "select" && itemsWrap.classList.contains("setup")) {
				// itemsWrap.classList.add("static");
				itemsWrapPackery.layout();
				setTimeout(() => {
					// itemsWrap.classList.remove("static");
					afterLayout();
				}, 100);
			}
		};

		document.onkeydown = (e) => {
			e = e || window.event;
			const keyCode = e.keyCode ? e.keyCode : e.which;
			let currEnviron, currVoiceAudioElem, currEnvironAudioElem;
			switch (keyCode) {
				case 27:
					body.classList.remove("full");
					closeFullscreen();
					break;
				case 37:
					if(body.classList.contains("alerts")) {
						const alertElem = document.querySelector(".alert.show");
						if(alertElem.id === "alert-streams-end") {
							alertElem.classList.remove("show");
							body.classList.remove("alerts");
						}
					} else if(currStreamObj) {
						currStreamObj.goToPrevScene();
					}
					break;
				case 39:
					if(body.classList.contains("alerts")) {
						return;
					}
					if(currStreamObj) {
						currStreamObj.goToNextScene();	
					}
					break;
				case 32:
					if(currSceneObj) {
						currEnviron = currSceneObj.elem.dataset.environ;
						currVoiceAudioElem = currStreamObj.elem.querySelector(".caption.show audio");
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
					}
					break;
				case 77:
					if(currSceneObj) {
						currEnviron = currSceneObj.elem.dataset.environ;
						currVoiceAudioElem = currStreamObj.elem.querySelector(".caption.show audio");
						currEnvironAudioElem = document.querySelector(`audio[data-environ="${currEnviron}"]`);
						body.classList.toggle("mute");
						if(body.classList.contains("mute")) {
							muteAudio(currVoiceAudioElem);
							muteAudio(currEnvironAudioElem);
						} else {
							unmuteAudio(currVoiceAudioElem);
							unmuteAudio(currEnvironAudioElem);
						}
					}
					break;
				default:
					break;
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
			const volBttns = document.querySelectorAll("button.volume");
			volBttns.forEach( (volBttn) => {
				volBttn.setAttribute("aria-pressed", true);
			});
		};

		const unmuteAudio = (elem) => {
			if(body.classList.contains("mute")) return;
			const type = elem.dataset.type;
			$(elem).animate({
				volume: volMax[type]
			}, fadeInDur[type]);
			const volBttns = document.querySelectorAll("button.volume");
			volBttns.forEach( (volBttn) => {
				volBttn.setAttribute("aria-pressed", false);
			});
		};



		const isMobile = () => {
			const styles = window.getComputedStyle(body);
			return [`"sm"`,`"md"`].includes(styles.content);
		}

		const isIframe = (e) => {
			try {
				return window.self !== window.top;
			} catch (e) {
				return true;
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
				fullTog.setAttribute("aria-pressed", true);
			} else {
				closeFullscreen();
				fullTog.setAttribute("aria-pressed", false);
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

		if(fullTog) {
			fullTog.onclick = () => {
				toggleFullscreen();
			};
		}

		if(helpTog) {
			helpTog.onclick = () => {
				if(body.classList.contains("alerts")) {
					closeAlert();
				} else {
					showAlert("streams-intro");
				}
			};
		}

		/************************************/
		/************STREAM SELECT***********/
		/************************************/

		const setUpSelect = () => {
			itemElems.forEach( (itemElem) => {
				const slug = itemElem.dataset.item,
							itemObj = new Item(itemElem);
				itemsArr[slug] = itemObj;
			});

			streamElems.forEach( (streamElem) => {
				const slug = streamElem.dataset.slug,
							streamObj = new Stream(streamElem);
				streamsArr[slug] = streamObj;
			});

			selectMenuBttns.forEach( (buttonElem) => {
				buttonElem.onclick = (e) => {
					const selectAlert = document.querySelector("#alert-select"),
								streamSlug = buttonElem.dataset.stream,
								streamObj = streams[streamSlug];
					selectAlert.classList.remove("show");
					body.classList.remove("alerts");
					streamObj.introStreams();
				};
			});
		};

		const handleSelect = () => {
			if(!itemsWrap.classList.contains("setup")) {
				itemsWrapPackery = new Packery(itemsWrap, {
					itemSelector: ".item",
					gutter: 20,
					transitionDuration: 0,
					initLayout: false,
					resize: false,
				});
				itemsWrapPackery.on('layoutComplete', afterLayout);
				itemsWrapPackery.layout();
				itemsWrap.classList.add("setup");
			} else {
				itemsWrapPackery.layout();
			}
		};

		const afterLayout = () => {
			itemElems.forEach( (itemElem) => {
				gsap.set(itemElem, {
					x: 0,
					y: 0
				});
			});
		}

		const showView = (viewSlug) => {
			const nextViewElem = document.querySelector(`#${viewSlug}-view`),
						currViewElem = document.querySelector(".view.show");

			if(nextViewElem) {
				nextViewElem.classList.add("show");
				nextViewElem.setAttribute("aria-hidden", false);
			}

			if(currViewElem) {
				currViewElem.classList.remove("show");
				currViewElem.setAttribute("aria-hidden", true);
			}

			body.id = viewSlug;
		};

		const showAlert = (alertSlug, onOkay, onCancel) => {
			const alertElem = document.querySelector(`#alert-${alertSlug}`),
						okayBttnElem = alertElem.querySelector(".okay"),
						cancelBttnElem = alertElem.querySelector(".cancel");

			alertElem.classList.add("show");
			body.classList.add("alerts");
			body.setAttribute("aria-hidden", false);

			if(okayBttnElem) {
				okayBttnElem.onclick = (e) => {
					closeAlert();
					if(onOkay) {
						onOkay(e);
					}
				};
			}

			if(cancelBttnElem) {
				cancelBttnElem.onclick = (e) => {
					closeAlert();
					if(onCancel) {
						onCancel(e);
					}
				};
			}
			
			var menuElem = alertElem.querySelector(`[role="menu"]`);
			if(menuElem) {
				menuElem.focus();
			}
		};

		const closeAlert = () => {
			const alertElem = document.querySelector(".alert.show");
			body.classList.remove("alerts");
			alertElem.classList.remove("show");	
			body.setAttribute("aria-hidden", true);
		}

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
				this.bin = null;

				this.draggable = Draggable.create(elem, {
					bounds: window,
					onPressInit: this.onPressInit.bind(this),
					onDragStart: this.onDragStart.bind(this),
					onDrag: this.onDrag.bind(this),
					onDragEnd: this.onDragEnd.bind(this)
				})[0];

				elem.onmouseover = () => {
					elem.classList.add("hovering");
					self.fixTooltip();
				};

				elem.onmouseleave = () => {
					elem.classList.remove("hovering");
				};
			}

			onPressInit() {
				const itemElem = this.elem,
							currX = gsap.getProperty(itemElem, "x"),
							currY  = gsap.getProperty(itemElem, "y"),
							newX = currX + parseInt(itemElem.style.left),
							newY = currY + parseInt(itemElem.style.top);
				gsap.set(itemElem, {
					x: newX,
					y: newY
				});
				itemElem.style.left = 0;
				itemElem.style.top = 0;
			}


			onDragStart(e) {
				body.classList.add("dragging");
			}

			onDrag(e) {
				const self = this,
							itemElem = this.elem;
				this.fixTooltip();
				binElems.forEach( (binElem) => {
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
				this.bin = null;
				binElems.forEach( (binElem) => {
					const isOver = Draggable.hitTest(itemElem, binElem, 50);
					if(isOver) {
						self.bin = binElem.dataset.bin;
					}
				});

				if(this.bin) {
					this.dropInBin();
				}

				itemElem.classList.remove("hovering");
				body.classList.remove("dragging");
				this.fixTooltip();
			}

			hoverBin(binElem) {
				const itemElem = this.elem,
							binSlug = binElem.dataset.bin,
							binBackElem = body.querySelector(`#${binSlug}-back`);
				binElem.classList.add("open");
				binBackElem.classList.add("open");
				itemElem.classList.add("opening");
			}

			unhoverBin(binElem) {
				const itemElem = this.elem,
							binSlug = binElem.dataset.bin,
							binBackElem = body.querySelector(`#${binSlug}-back`);
				binElem.classList.remove("open");
				binBackElem.classList.remove("open");
				itemElem.classList.remove("opening");
			}

			dropInBin() {
				const self = this,
							itemsWrapBounds = itemsWrap.getBoundingClientRect(),
							itemElem = this.elem,
							itemBounds = itemElem.getBoundingClientRect(),
							binSlug = this.bin,
							binElem = body.querySelector(`#${binSlug}-bin .bin-front`),
							binBounds = binElem.getBoundingClientRect(),
							binStreamArr = binSlug.split("-"),
							timeline = gsap.timeline(),
							newItemLeft =
								binBounds.left
								+ ( binBounds.width/2 )
								- ( itemBounds.width/2 )
								- itemsWrapBounds.left,
							itemStreamSlug = itemElem.dataset.stream;

				binElem.classList.add("open");
				itemElem.classList.add("dropping");
				itemElem.classList.remove("opening");
				timeline
					.to(itemElem, {
						x: newItemLeft,
						duration: .25
					})
					.to(itemElem, {
						y: window.innerHeight,
						duration: .75
					});

				if(binStreamArr.includes(itemStreamSlug)) {
					const streamObj = streams[itemStreamSlug];
					showAlert("correct-bin",
						() => {
							const itemImg = itemElem.querySelector("img");
							selectedItem.src = itemImg.src;
							streamObj.introStreams();
							self.liftFromBin(timeline, true);
						},
						() => {
							self.liftFromBin(timeline, true);
						}
					);
				} else {
					self.liftFromBin(timeline);
					if(itemStreamSlug === "landfill") {
						showAlert("not-recycle", function () {
							timeline.call(() => {
								self.refreshItems();
							});
						});
					} else if(!binStreamArr.includes("landfill")) {
						showAlert("wrong-recycle", function () {
							timeline.call(() => {
								self.refreshItems();
							});
						});
					} else {
						showAlert("not-trash", function () {
							timeline.call(() => {
								self.refreshItems();
							});
						});
					}
				}
			}

			liftFromBin(timeline, refresh) {
				const self = this,
							itemElem = this.elem,
							itemBounds = itemElem.getBoundingClientRect(),
							binSlug = this.bin,
							binElem = body.querySelector(`#${binSlug}-bin`),
							binBounds = binElem.getBoundingClientRect(),
							newItemTop =
								window.innerHeight
								- parseInt(itemElem.style.top)
								- binBounds.height
								- itemBounds.height;

				itemElem.classList.remove("dropping");
				itemElem.classList.add("returning");

				timeline.to(itemElem, {
					y: newItemTop,
					duration: .25,
					onComplete: () => {
						if(refresh) {
							self.refreshItems();
						}
					}
				});
			}

			refreshItems() {
				const itemElem = this.elem,
							binSlug = this.bin,
							binElem  = body.querySelector(`#${binSlug}-bin`),
							binBackElem = body.querySelector(`#${binSlug}-back`);
				binBackElem.classList.remove("open");
				binElem.classList.remove("open");
				itemElem.classList.remove("dropping");
				itemElem.classList.remove("returning");

				itemsWrap.classList.remove("static");
				itemsWrapPackery.layout();

				this.bin = null;
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
				this.scene = null;
				this.scenes = {};
				this.scenesWrap = elem.querySelector(".scenes-wrap");
				this.progress = elem.querySelector(".progress");
				this.volBttn = elem.querySelector(".audio-button.volume");
				this.playbackBttn = elem.querySelector(".audio-button.playback");
				this.prevArrow = elem.querySelector(".arrow[data-dir='prev']");
				this.nextArrow = elem.querySelector(".arrow[data-dir='next']");

				this.prevArrow.onclick = () => {
					self.goToPrevScene();
				};
				this.nextArrow.onclick = () => {
					self.goToNextScene();
				};

				this.volBttn.onclick = () => {
					const currSceneObj = self.scene,
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
					self.volBttn.blur();
				};

				this.playbackBttn.onclick = (e) => {
					const currSceneObj = self.scene,
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
					self.playbackBttn.blur();
				};

				this.setUpScenes();
				streams[this.slug] = this;
			}

			setUpScenes() {
				const self = this,
							sceneElems = this.elem.querySelectorAll(".scene:not(.setup)"),
							svgReqs = [];

				sceneElems.forEach( (sceneElem, i) => {
					const sceneSlug = sceneElem.dataset.scene,
								sceneObj = new Scene(sceneElem, self);

					scenesArr[sceneSlug] = sceneObj;
					self.scenes[sceneSlug] = sceneObj;

					if(i === 0) {
						self.scene = sceneObj;
					}

					if(sceneObj.req) {
						svgReqs.push(sceneObj.req);
					}
				});

				Promise.all(svgReqs).then((responses) => {
					introBttn.setAttribute("aria-disabled", false);
					introBttn.onclick = () => {
						showView("select");
						handleSelect();
						showAlert("select-intro");
					};
					introView.classList.remove("loading");
				});
			}

			introStreams() {
				const self = this;
				selectView.classList.remove("show");
				body.id = "";

				if(!streamIntrod) {
					streamIntrod = true;
					showAlert("streams-intro", () => {
						self.startStreaming();
					});
				} else {
					this.startStreaming();
				}
			}

			startStreaming() {
				const nextStreamElem = this.elem,
							currStreamElem = body.querySelector(".stream.show"),
							currSceneElem = body.querySelector(".scene.show"),
							droppingItemElem = body.querySelector(".item.dropping");

				currStreamObj = this;

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
				showView("streams");

				const firstSceneObj = this.scenes[`garage-${this.slug}`];
				this.goToScene(firstSceneObj);
				this.progress.focus();
			}

			goToScene(nextSceneObj) {
				if(body.id !== "streams") return;
				const nextSceneElem = nextSceneObj ? nextSceneObj.elem : this.ending,
							nextSceneCaptionElem = nextSceneObj.caption,
							nextVoiceAudioElem = nextSceneObj.voiceover,
							currSceneElem = this.scenesWrap.querySelector(".scene.show"),
							currTickElem = this.elem.querySelector(".tick.active"),
							currCaptionElem = this.elem.querySelector(".caption.show"),
							currVoiceAudioElem = currCaptionElem ? currCaptionElem.querySelector("audio") : null;
				let currEnviron;

				if(currSceneElem) {
					currSceneElem.setAttribute("aria-hidden", true);
					currCaptionElem.setAttribute("aria-hidden", true);
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
				}

				if(currVoiceAudioElem) {
					pauseAudio(currVoiceAudioElem);
				}

				if(nextSceneObj.animation) {
					nextSceneObj.animation.goToAndPlay(0);
				}

				if(!nextSceneElem) {
					return;
				}

				nextSceneElem.classList.add("show");
				nextSceneElem.setAttribute("aria-hidden", false);

				if(nextSceneCaptionElem) {
					nextSceneCaptionElem.setAttribute("aria-hidden", false);
				}

				this.scene = nextSceneObj;
				nextSceneObj.prepareScene();

				if(nextVoiceAudioElem) {
					playAudio(nextVoiceAudioElem);
				}

				const nextEnvironAudioElem = nextSceneObj.environ;
				if(!currEnviron) {
					return playAudio(nextEnvironAudioElem);
				}

				const currSceneSlug = currSceneElem.dataset.scene,
							currSceneObj = this.scenes[currSceneSlug],
							currEnvironAudioElem = currSceneObj.environ,
							nextEnviron = nextSceneElem.dataset.environ;

				if(!nextEnviron) {
					pauseAudio(currEnvironAudioElem);
				} else if(currEnviron !== nextEnviron) {
					pauseAudio(currEnvironAudioElem);
					playAudio(nextEnvironAudioElem);
				}
			}

			goToNextScene() {
				const currSceneObj = this.scene,
							currSceneSlug = currSceneObj.slug,
							currSceneElem = this.elem.querySelector(`.scene[data-scene="${currSceneSlug}"]`),
							nextSceneElem = currSceneElem.nextSibling;

				if(nextSceneElem) {
					const nextSceneSlug = nextSceneElem.dataset.scene,
								nextSceneObj = this.scenes[nextSceneSlug];
					this.goToScene(nextSceneObj);
				} else {
					pauseAudio(currSceneObj.voiceover);
					body.id = "";
					streamsView.classList.remove("show");
					handleSelect();
					showAlert("streams-end", () => {
						showView("select");
					});
				}
			}

			goToPrevScene() {
				const currSceneObj = this.scene,
							currSceneSlug = currSceneObj.slug,
							currSceneElem = this.elem.querySelector(`.scene[data-scene="${currSceneSlug}"]`),
							prevSceneElem = currSceneElem.previousSibling;

				if(prevSceneElem) {
					const prevSceneSlug = prevSceneElem.dataset.scene,
								prevSceneObj = this.scenes[prevSceneSlug];
					this.goToScene(prevSceneObj);
				} else {
					const currVoiceAudioElem = currSceneObj.voiceover,
								currEnvironAudioElem = currSceneObj.environ;
					if(currVoiceAudioElem) {
						pauseAudio(currVoiceAudioElem);
					}
					if(currEnvironAudioElem) {
						pauseAudio(currEnvironAudioElem);
					}
					showView("select");
					handleSelect();
				}
			}
		}

		class Scene {
			constructor(sceneElem, streamObj) {
				this.elem = sceneElem;
				this.slug = sceneElem.dataset.scene;
				this.stream = streamObj;
				this.color = sceneElem.dataset.color;

				this.tick = streamObj.elem.querySelector(
					`.tick[data-scene="${this.slug}"]`
				);
				this.caption = streamObj.elem.querySelector(
					`.caption[data-scene="${this.slug}"]`
				);
				this.voiceover = this.caption.querySelector("audio");

				const environ = sceneElem.dataset.environ;
				this.environ = document.querySelector(`audio[data-environ="${environ}"]`);
				
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
				this.req = fetch(this.elem.dataset.src)
					.then((response) => {
						if(!response.ok) {
							self.elem.classList.add("setup");
							throw new Error(`${self.slug} scene is not found`);
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
			}

			setUpScene() {
				const self = this,
							sceneElem = this.elem,
							tickElem = this.tick,
							captionElem = this.caption,
							voiceAudioElem = this.voiceover,
							factoidElems = this.factoids;

				if(tickElem) {
					tickElem.onclick = () => {
						const stream = self.stream;
						stream.goToScene(self);
					};
				}

				if(voiceAudioElem) {
					voiceAudioElem.onplay = () => {
						body.classList.add("playing");
					};
					voiceAudioElem.onpause = () => {
						const caption = voiceAudioElem.parentElement;
						if(caption.classList.contains("show")) {
							body.classList.remove("playing");
						}
					};
					voiceAudioElem.onended = () => {
						const caption = voiceAudioElem.parentElement;
						if(caption.classList.contains("show")) {
							body.classList.remove("playing");
						}
					};
				}

				factoidElems.forEach( (factoidElem) => {
					const tabElem = factoidElem.querySelector(".factoid-tab");
					tabElem.onclick = (e) => {
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
					vocabElems.forEach( (vocabElem) => {
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

			prepareScene() {
				const sceneColor = this.color,
							tickElem = this.tick,
							captionElem = this.caption,
							sceneElem = this.elem,
							voiceAudioElem = this.voiceover;

				if(voiceAudioElem) {
					voiceAudioElem.load();
				}
				if(captionElem) {
					captionElem.classList.add("show");
				}
				if(tickElem) {
					tickElem.classList.add("active");
				}
				sceneElem.classList.add("animate");
				streamsView.dataset.color = sceneColor;
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
		}

		setUpSelect();

		setTimeout(() => {
			body.classList.replace("loading", "loaded");
		}, 4000);

		if(isIframe()) {
			body.classList.add("full");
		}
	};
};

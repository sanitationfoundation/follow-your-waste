import "../sass/style.scss";
import lottie from "lottie-web";
import $ from "jquery";
import Draggabilly from "draggabilly";
import Packery from "packery";

const initSite = () => {
	let itemsWrapPackery, currStreamObj, currSceneObj, streamIntrod;
	const body = document.querySelector("body"),
				docElem = document.documentElement,
				fullTog = document.querySelector("#full-toggle"),
				helpTog = document.querySelector("#help-toggle"),
				restartBttn = document.querySelector("#restart-button"),
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
				alertsView = document.querySelector("#alerts-view"),
				itemsObj = {},
				scenesArr = [],
				streamsArr = [],
				streams = {
					landfill: "Landfill",
					paper: "Paper",
					metal: "Metal",
					glass: "Glass",
					plastic: "Plastic"
				},
				fadeInDur = {
					voice: 50,
					environ: 1000
				},
				fadeOutDur = {
					voice: 500,
					environ: 1000
				},
				volMax = {
					voice: 1,
					environ: .75
				},
				packeryDur = 300;

	window.onresize = () => {
		scenesArr.forEach( (sceneObj) => {
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
						body.id = "streams";
						streamsView.classList.add("show");
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


	const playAudio = (elem) => {
		if(body.classList.contains("mute")) return;
		const type = elem.dataset.type;
		$(elem).prop("volume", 0);
		elem.currentTime = 0;
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

	// const isMobile = () => {
	// 	const styles = window.getComputedStyle(body);
	// 	return [`"sm"`,`"md"`].includes(styles.content);
	// }


	const isIframe = (e) => {
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
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

	window.addEventListener("onfullscreenchange", (e) => {
		if(document.fullscreenElement) {
			body.classList.add("full");
		} else {
			body.classList.remove("full");
		}
	});


	window.addEventListener("visibilitychange", (e) => {
		const audioElems = document.querySelectorAll("audio");
		audioElems.forEach((audioElem) => {
			if(document.visibilityState === "visible") {
				audioElem.muted = false;
			} else {
				audioElem.muted = true;
			}
		});
	});

	if(docElem.requestFullscreen) {
		if(fullTog) {
			fullTog.addEventListener("click", () => {
				toggleFullscreen();
			});
		}

		if(helpTog) {
			helpTog.addEventListener("click", () => {
				if(body.classList.contains("alerts")) {
					closeAlert();
				} else {
					openAlert("streams-intro");
				}
			});
		}
	} else {
		body.classList.add("no-fullscreen");
	}

	if(restartBttn) {
		restartBttn.addEventListener("click", () => {
			if(currStreamObj) {
				currStreamObj.stopStreaming(false);
			}
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

	const openAlert = (alertSlug, onOkay, onCancel) => {
		const alertElem = document.querySelector(`#alert-${alertSlug}`),
					okayBttnElem = alertElem.querySelector(".okay"),
					cancelBttnElem = alertElem.querySelector(".cancel"),
					audioElem = alertElem.querySelector("audio");

		alertElem.classList.add("show");
		body.classList.add("alerts");
		body.setAttribute("aria-hidden", false);

		if(audioElem) {
			playAudio(audioElem);
		}

		if(okayBttnElem) {
			okayBttnElem.onclick = (e) => {
				closeAlert();
				if(onOkay) {
					onOkay();
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

		alertsView.onclick = (e) => {
			if(!e.target.classList.contains("view-inner")) return;
			closeAlert();
			if(okayBttnElem && !cancelBttnElem && onOkay) {
				onOkay();
			}
			if(cancelBttnElem && onCancel) {
				onCancel();
			}
		};
		
		var menuElem = alertElem.querySelector(`[role="menu"]`);
		if(menuElem) {
			menuElem.focus();
			alertElem.scrollTop = 0;
		}
	};

	const closeAlert = () => {
		const alertElem = document.querySelector(".alert.show"),
					audioElem = alertElem.querySelector("audio");
		body.classList.remove("alerts");
		pauseAudio(audioElem);

		setTimeout(() => {
			alertElem.classList.remove("show");
		}, 500);
		body.setAttribute("aria-hidden", true);
	}

	/************************************/
	/************STREAM SELECT***********/
	/************************************/

	const setUpSelect = () => {
		itemElems.forEach( (itemElem) => {
			const slug = itemElem.dataset.item,
						itemObj = new Item(itemElem);
			itemsObj[slug] = itemObj;
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
				gutter: 10,
				transitionDuration: packeryDur,
				initLayout: false,
				resize: true,
				stamp: "#stamp"
			});
			itemsWrapPackery.layout();
			itemsWrap.classList.add("setup");
		} else {
			itemsWrapPackery.options.transitionDuration = 0;
			itemsWrapPackery.layout();
			itemsWrapPackery.options.transitionDuration = packeryDur;
		}
	};

	const toggleSelectElems = (show, callback) => {
		const itemsKeys = Object.keys(itemsObj);
		for(let i = itemsKeys.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[itemsKeys[i], itemsKeys[j]] = [itemsKeys[j], itemsKeys[i]];
    }
    if(show) {
    	handleSelect();
    }
		selectView.classList.toggle("show-bins", show);

		itemsKeys.forEach((itemKey, i) => {
			const itemObj = itemsObj[itemKey],
						itemElem = itemObj.elem;


			setTimeout(() => {
				if(!itemElem.classList.contains("dropping")) {
					itemElem.classList.add("setting");
					itemElem.classList.toggle("show", show);
				} 
				
				setTimeout(() => {
					itemElem.classList.remove("setting");
			  }, 1000);

			  if(itemElem.classList.contains("dropping") && !show) {
			  	setTimeout(() => {
						itemElem.classList.remove("show", "dropping");
					}, 10 * itemsKeys.length + 1100);
				}

			}, (show ? 50 : 10) * i);
		});

		if(callback) {
			setTimeout(() => {
				callback();
			}, 500);
		}
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
			this.draggie = new Draggabilly(this.elem);

			this.draggie.on("dragStart", this.onDragStart.bind(this));
			this.draggie.on("dragMove", this.onDrag.bind(this));
			this.draggie.on("dragEnd", this.onDragEnd.bind(this));

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
			const itemElem = this.elem,
						itemBounds = itemElem.getBoundingClientRect();
			this.fixTooltip();

			let binSlug;
			binElems.forEach((binElem) => {
				const binBounds = binElem.getBoundingClientRect();
				if(this.isOver(itemBounds, binBounds)) {
					binSlug = binElem.dataset.bin
				}
			});

			if(binSlug) {
				selectView.dataset.bin = binSlug;
			} else {
				delete selectView.dataset.bin;
			}

			this.fixTooltip();
		}

		onDragEnd(e) {
			if(selectView.hasAttribute("data-bin")) {
				this.bin = selectView.dataset.bin;
				if(this.bin) {
					this.dropInBin();
				}
			} 

			this.elem.classList.remove("hovering");
			body.classList.remove("dragging");
			this.fixTooltip();
		}

		isOver(itemBounds, binBounds) {
			return itemBounds.x < binBounds.x + binBounds.width &&
						 itemBounds.x + itemBounds.width > binBounds.x &&
						 itemBounds.y < binBounds.y + binBounds.height &&
						 itemBounds.y + itemBounds.height > binBounds.y;
		}

		dropInBin() {
			const self = this,
						itemsWrapBounds = itemsWrap.getBoundingClientRect(),
						itemElem = this.elem,
						itemBounds = itemElem.getBoundingClientRect(),
						binSlug = this.bin,
						binElem = body.querySelector(`#${binSlug}-bin .bin-front`),
						binBounds = binElem.getBoundingClientRect(),
						newItemLeft =
							binBounds.left
							+ ( binBounds.width/2 )
							- ( itemBounds.width/2 )
							- itemsWrapBounds.left,
						newItemTop = window.innerHeight,
						itemStreamSlug = itemElem.dataset.stream;

			itemElem.classList.add("dropping");
			itemElem.classList.remove("opening");
			itemElem.classList.remove("hovering");

			$(itemElem).animate({
				left: `${newItemLeft}px`
			}, 300).animate({
				top: `${newItemTop}px`
			}, 500);

			if(binSlug === itemStreamSlug
				|| (binSlug === "mgp"
				&& ["metal", "glass", "plastic"].includes(itemStreamSlug))) {
				const streamObj = streams[itemStreamSlug];
				openAlert("correct-bin",
					() => {
						const itemImg = itemElem.querySelector("img");
						selectedItem.src = itemImg.src;
						delete selectView.dataset.bin;
						streamObj.introStreams();
					},
					() => {
						self.liftFromBin(() => {
							self.resetItem();
						});
					}
				);

			} else {
				self.liftFromBin(() => {
					if(itemStreamSlug === "landfill") {
						openAlert("not-recycle", () => {
							self.resetItem();
						});
					} else if(binSlug !== "landfill") {
						openAlert("wrong-recycle", () => {
							self.resetItem();
						});
					} else {
						openAlert("not-trash", () => {
							self.resetItem();
						});
					}
				});
			}
		}

		liftFromBin(callback) {
			const itemElem = this.elem,
						itemBounds = itemElem.getBoundingClientRect(),
						binSlug = this.bin,
						binElem = body.querySelector(`#${binSlug}-bin`),
						binBounds = binElem.getBoundingClientRect(),
						newItemTop =
							window.innerHeight
							- binBounds.height
							- itemBounds.height;

			$(itemElem).animate({
				top: `${newItemTop}px`,
			}, 500, () => {
				delete selectView.dataset.bin;
				itemElem.classList.remove("dropping");
				if(callback) {
					callback();
				}
			});
		}

		resetItem() {
			const itemElem = this.elem;
			itemElem.classList.add("returning");
			itemsWrapPackery.layout();
			itemElem.classList.remove("returning");

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

	const setUpStreams = () => {
		streamElems.forEach( (streamElem) => {
			const slug = streamElem.dataset.slug,
						streamObj = new Stream(streamElem);
			streamsArr[slug] = streamObj;
		});
	}

	class Stream {
		constructor(elem) {
			const self = this;
			this.elem = elem;
			this.slug = elem.dataset.slug;
			this.scene = null;
			this.scenes = {};
			this.bin = ["metal","glass","plastic"].includes(this.slug) ? "mgp" : this.slug;
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
						sceneElems = this.elem.querySelectorAll(".scene:not(.setup)");

			sceneElems.forEach( (sceneElem, i) => {
				const sceneSlug = sceneElem.dataset.scene,
							sceneObj = new Scene(sceneElem, self);

				scenesArr[sceneSlug] = sceneObj;
				self.scenes[sceneSlug] = sceneObj;

				if(i === 0) {
					self.scene = sceneObj;
				}
			});
		}

		introStreams() {
			const self = this,
						restartBttnImg = restartBttn.querySelector(`[data-stream="${this.bin}"]`);

			restartBttn.append(restartBttnImg);
			self.loadAssets();

			toggleSelectElems(false, () => {
				selectView.classList.remove("show");
				if(!streamIntrod) {
					streamIntrod = true;
					openAlert("streams-intro", () => {
						self.startStreaming();
					});
				} else {
					self.startStreaming();
				}
			});

		}

		loadAssets() {
			const self = this,
						sceneElems = this.elem.querySelectorAll(".scene:not(.loaded)");
			sceneElems.forEach((sceneElem) => {
				const sceneSlug = sceneElem.dataset.scene,
							sceneObj = self.scenes[sceneSlug];
				if(sceneObj.elem.dataset.animated === "true") {
					sceneObj.getAnimation();
				} else {
					sceneObj.getSvg();
				}
			});
		}

		startStreaming() {
			const nextStreamElem = this.elem,
						currStreamElem = body.querySelector(".stream.show"),
						currSceneElem = body.querySelector(".scene.show");

			currStreamObj = this;

			if(currStreamElem) {
				currStreamElem.classList.remove("show");
				currStreamElem.setAttribute("aria-hidden", true);
			}
			if(currSceneElem) {
				currSceneElem.classList.remove("show");
			}

			nextStreamElem.classList.remove("exit");
			nextStreamElem.classList.add("show");
			nextStreamElem.setAttribute("aria-hidden", false);

			showView("streams");
			
			const firstSceneObj = this.scenes[`garage-${this.slug}`];
			this.goToScene(firstSceneObj);
			this.progress.focus();
		}

		stopStreaming(withAlert) {
			const self = this;
			body.id = "";
			streamsView.classList.remove("show");
			pauseAudio(this.scene.voiceover);
			handleSelect();
			if(withAlert) {
				openAlert("streams-end", () => {
					muteAudio(self.scene.environ);
					toggleSelectElems(true);
					showView("select");
					currStreamObj = null;
				});
			} else {
				muteAudio(this.scene.environ);
				toggleSelectElems(true);
				showView("select");
				currStreamObj = null;
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
				this.stopStreaming(true);
			}
		}

		goToPrevScene() {
			if(body.id !== "streams") return;
			const currSceneObj = this.scene,
						currSceneSlug = currSceneObj.slug,
						currSceneElem = this.elem.querySelector(`.scene[data-scene="${currSceneSlug}"]`),
						prevSceneElem = currSceneElem.previousSibling;
			if(prevSceneElem) {
				const prevSceneSlug = prevSceneElem.dataset.scene,
							prevSceneObj = this.scenes[prevSceneSlug];
				this.goToScene(prevSceneObj);
			} else {
				const currSceneElem = this.scenesWrap.querySelector(".scene.show"),
							currCaptionElem = this.elem.querySelector(".caption.show"),
							currVoiceAudioElem = currSceneObj.voiceover,
							currEnvironAudioElem = currSceneObj.environ;
				if(currSceneElem) {
					currSceneElem.classList.remove("show");
				}
				if(currCaptionElem) {
					currCaptionElem.classList.remove("show");
				}
				if(currVoiceAudioElem) {
					pauseAudio(currVoiceAudioElem);
				}
				if(currEnvironAudioElem) {
					pauseAudio(currEnvironAudioElem);
				}
				toggleSelectElems(true);
				showView("select");
			}
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
	}

	class Scene {
		constructor(sceneElem, streamObj) {
			const self = this;
			this.elem = sceneElem;
			this.slug = sceneElem.dataset.scene;
			this.stream = streamObj;
			// this.color = sceneElem.dataset.color;

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

			this.svgWrap = sceneElem.querySelector(".svg-wrap");

			this.svgWrap.onclick = (e) => {
				self.factoids.forEach((factoid, i) => {
					setTimeout(() => {
						factoid.classList.remove("open");
					}, i * 100);
				});
			};

		}

		getAnimation() {
			const self = this,
						looped = this.elem.dataset.looped === "true";

			const animation = lottie.loadAnimation({
				container: this.svgWrap,
				renderer: "svg",
				loop: looped,
				autoplay: false,
				path: this.elem.dataset.src
			});

			animation.addEventListener("loaded_images", (e) => {
				self.elem.classList.add("loaded");
				animation.goToAndPlay(0);
			});


			this.animation = animation;
			this.setUpScene();
		}

		getSvg() {
			const self = this;
			this.req = fetch(this.elem.dataset.src)
				.then((response) => {
					if(!response.ok) {
						throw new Error(`${self.slug} scene is not found`);
					} else {
						return response.text();
					}
				})
				.then((svg) => {
					self.elem.classList.add("loaded");
					if(!self.svgWrap) return;
					self.svgWrap.insertAdjacentHTML("afterbegin", svg);
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
			const tickElem = this.tick,
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

	const setUp = () => {
		body.classList.replace("loading", "loaded");
		introBttn.setAttribute("aria-disabled", false);
		introBttn.onclick = () => {
			introView.classList.remove("show");
			body.id = "select-intro";
			selectView.classList.add("show-bins");
			handleSelect();
			openAlert("select-intro", () => {
				toggleSelectElems(true);
				showView("select");
			});
		};
		introView.classList.remove("loading");
	}

	setUpStreams();
	setUpSelect();

	setTimeout(() => {
		setUp();
	}, 5000);

	if(isIframe()) {
		body.classList.add("full");
	}


};

export default initSite;
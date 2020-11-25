import { gsap } from "gsap";

const garage = function(sceneElem) {
	const truck = sceneElem.querySelector(".truck"),
				truckBounds = truck.getBoundingClientRect();
	gsap.fromTo(truck, {
		x: (window.innerWidth - truckBounds.right  + truckBounds.width) + "px",
	}, {
		duration: 5,
		x: "0",
	});
}

const garagePaper = function(sceneElem) {
	const truck = sceneElem.querySelector("#garage-paper-truck"),
				truckBounds = truck.getBoundingClientRect();
	gsap.fromTo(truck, {
		x: (window.innerWidth - truckBounds.right  + truckBounds.width) + "px",
	}, {
		duration: 5,
		x: "0",
	});
}

const curbsidePaper = function(sceneElem) {
	const hand = sceneElem.querySelector("#curbside-paper-hand"),
				handBounds = hand.getBoundingClientRect();
	gsap.fromTo(hand, {
		y: -handBounds.height + "px",
	}, {
		y: "0",
		duration: 1,
	});
}

const curbsideLandfill = function(sceneElem) {
	const hand = sceneElem.querySelector("#curbside-landfill-hand"),
				handBounds = hand.getBoundingClientRect();
	gsap.fromTo(hand, {
		y: -handBounds.height + "px",
	}, {
		y: "0",
		duration: 1,
	});
}

const mts = function(sceneElem) {
	const water = sceneElem.querySelector("#mts-water"),
				waterBounds = water.getBoundingClientRect(),
				timeline = gsap.timeline({
					repeat:-1
				});
	timeline.to(water, {
		y: "10px",
		duration: 2
	});
	timeline.to(water, {
		y: "0px",
		duration: 2
	});
}

const weighing = function(sceneElem) {
	const machine = sceneElem.querySelector(".weighing-machine"),
				machineBounds = machine.getBoundingClientRect(),
				weighingTruck = sceneElem.querySelector(".weighing-truck"),
				weighingTruckBounds = weighingTruck.getBoundingClientRect(),
				weighingTruckX1 = -weighingTruckBounds.left  - weighingTruckBounds.width,
				weighingTruckX2 = machineBounds.left - machineBounds.width - weighingTruckBounds.width,
				weighingTruckX3 = weighingTruckBounds.right + weighingTruckBounds.width,
				weighingTruckTimeline = gsap.timeline({
					repeat: -1,
					repeatDelay: 9.5
				});
	weighingTruckTimeline.fromTo(weighingTruck, {
		x: weighingTruckX1 + "px",
	}, {
		x: weighingTruckX2 + "px",
		duration: 6,
		"ease": "power2.out"
	})
	weighingTruckTimeline.to(weighingTruck, {
		x: weighingTruckX3 + "px",
		duration: 3.5,
		"ease": "power1.in"
	});

}


const barge = function(sceneElem) {
	const barge = document.querySelector(".barge"),
				bargeBounds = barge.getBoundingClientRect();
	gsap.fromTo(barge, {
		y: -bargeBounds.height*.7 + "px",
	}, {
		y: "0",
		duration: 13,
		"ease": "power1.out"
	});

	const bargeTimeline = gsap.timeline({
		repeat: -1,
	});

	bargeTimeline.delay(13);
	bargeTimeline.fromTo(barge, {
		x: "0",
		y: "0",
	}, {
		x: "-10px",
		y: "-10px",
		duration: 3,
		ease: "sine.inOut"
	});
	bargeTimeline.to(barge, {
		x: "-5px",
		y: "0px",
		duration: 3,
		ease: "sine.inOut"
	});
	bargeTimeline.to(barge, {
		x: "5px",
		y: "-7.5px",
		duration: 3,
		ease: "sine.inOut"
	});
	bargeTimeline.to(barge, {
		x: "0",
		y: "0",
		duration: 3,
		ease: "sine.inOut"
	});

}

const craneLandfill = function() {
	const container = document.querySelector("#crane-landfill-container"),
				containerBounds = container.getBoundingClientRect();

	gsap.fromTo(container, {
		y: -50 + "px",
	}, {
		y: "0",
		duration: 8,
	});	
};

const lidding = function() {
	const lid = document.querySelector("#lidding-lid"),
				lidBounds = lid.getBoundingClientRect();

	gsap.fromTo(lid, {
		y: -lidBounds.height + "px",
	}, {
		y: "0",
		duration: 8,
	});	
};


const pratt = function() {
	const claw = document.querySelector("#claw"),
				clawBounds = claw.getBoundingClientRect();
	// gsap.set(claw, {
	// 	x: -clawBounds.width/2 + "px",
	// 	y: -clawBounds.height + "px",
	// });
	gsap.fromTo(claw, {
		y: -clawBounds.height + "px",
	}, {
		y: "0",
		duration: 3,
	});

	// document.addEventListener('mousemove', e => {
	// 	const clawBounds = claw.getBoundingClientRect(),
	// 				newClawX = e.pageX;
	// 	gsap.to(claw, {
	// 		x: newClawX + "px",
	// 	});
	// });
}

export var animations = {
	// 'garage': garage,
	// 'garage-paper': garagePaper,
	'curbside-paper': curbsidePaper,
	'curbside-landfill': curbsideLandfill,
	'mts': mts,
	// 'weighing': weighing,
	'barge-paper': barge,
	'barge-landfill': barge,
	'crane-landfill': craneLandfill,
	'lidding': lidding,
	'pratt': pratt
};

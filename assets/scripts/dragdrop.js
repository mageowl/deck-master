let dragging = null;

const draggable = (card, handler) => {
	card.droppable = true;
	card.dropHandler = handler;
	card.onmousedown = function (event) {
		if (card.droppable == false) return;

		let top = card.style.top;
		let left = card.style.left;
		let noParentLeft = card.getBoundingClientRect().left;
		let noParentTop = card.getBoundingClientRect().top;

		let shiftX = event.clientX - noParentLeft;
		let shiftY = event.clientY - noParentTop;

		dragging = card;

		card.style.position = "absolute";
		card.style.cursor = "url(assets/art/cursor/grabbing.png) 16 16, pointer";
		card.style.transform = "scale(1.2)";
		card.style.zIndex = 1000;
		document.body.append(card);

		moveAt(event.pageX, event.pageY);

		// moves the card at (pageX, pageY) coordinates
		// taking initial shifts into account
		function moveAt(pageX, pageY) {
			card.style.left = pageX - shiftX + "px";
			card.style.top = pageY - shiftY + "px";
		}

		function onMouseMove(event) {
			moveAt(event.pageX, event.pageY);
		}

		// move the card on mousemove
		document.addEventListener("mousemove", onMouseMove);

		let currentDrop = null;

		// Drop the card, remove unneeded handlers
		function drop(event) {
			card.style.transform = "none";
			card.style.zIndex = -1;
			card.style.cursor = "url(assets/art/cursor/grab.png) 16 16, pointer";

			dragging = null;

			// Check for card to drop onto.
			let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
			card.style.zIndex = 0;

			let dropBelow = elemBelow.closest(".drop");

			let targetType;
			if (dropBelow != null) {
				targetType = Array.from(dropBelow.classList).filter((value) => {
					return value != "card";
				})[0];
				targetType = targetType.substr(0, targetType.length - 5);
				if (targetType == "item") {
					dropBelow = null;
				}
			}

			card.style.transition = "top 500ms, left 500ms, transform 400ms";
			if (dropBelow != currentDrop) {
				card.droppable = false;
				currentDrop = dropBelow;
				if (currentDrop) {
					handler(card, currentDrop);
					card.style.left = currentDrop.getBoundingClientRect().left;
					card.style.top = currentDrop.getBoundingClientRect().top;
					card.dropped = true;
					let left = currentDrop.style.left;
					let top = parseInt(currentDrop.style.top) + 198;
					setTimeout(() => {
						card.style.transition = "transform 400ms";
						boardElmt.appendChild(card);
						card.style.left = left;
						card.style.top = top;
						setTimeout(() => {
							card.droppable = true;
						}, 300);
					}, 1001);
				}
			} else {
				card.style.left = parseInt(noParentLeft) + 0;
				card.style.top = noParentTop;
				setTimeout(() => {
					card.style.transition = "transform 400ms";
					boardElmt.appendChild(card);
					card.style.left = left;
					card.style.top = top;
				}, 501);
			}

			document.removeEventListener("mousemove", onMouseMove);
			card.onmouseup = null;
		}

		card.drop = drop;
		card.onmouseup = drop;
	};

	card.ondragstart = function () {
		return false;
	};
};

const undraggable = (card) => {
	card.droppable = false;
	card.onmousedown = null;
};

window.oncontextmenu = (e) => {
	if (!e.metaKey) e.preventDefault();
};

document.onmouseleave = (e) => {
	if (dragging) {
		dragging.drop({ clientX: 0, clientY: 0 });
	}
};

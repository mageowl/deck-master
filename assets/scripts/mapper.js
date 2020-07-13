class GamepadMap {
	constructor(id) {
		this.id = id;
		this.model = "noPad";
		this.map = { btns: {}, axes: {} };
		if (navigator.getGamepads()[id] != undefined) {
			this.gamepad = navigator.getGamepads()[id];
			this.model = this.gamepad.id;
		}
	}

	getBtn(button) {
		this.reload();
		return this.gamepad.buttons[this.map.btns[button][0]].pressed;
	}

	getBtnPress(button) {
		this.reload();
		let btnPressed = this.map.btns[button][1];
		let pressed = this.gamepad.buttons[this.map.btns[button][0]].pressed;

		if (pressed) {
			if (btnPressed == false) {
				this.map.btns[button][1] = true;
				return true;
			}
		} else {
			this.map.btns[button][1] = false;
		}
		return false;
	}

	getAxis(axis) {
		this.reload();
		return this.gamepad.axes[this.map.axes[axis]];
	}

	reload() {
		if (navigator.getGamepads()[this.id] != undefined) {
			this.gamepad = navigator.getGamepads()[this.id];
			this.model = this.gamepad.id;
		} else {
			this.model = "noPad";
		}
	}

	addMappedBtn(name, btnID) {
		this.map.btns[name] = [btnID, false];
	}

	addMappedAxis(name, axisID) {
		this.map.axes[name] = axisID;
	}
}

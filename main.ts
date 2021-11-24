radio.onReceivedString(function (receivedString) {
    signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    music.setVolume(Math.map(signal, -95, -42, 0, 250))
    if (signal >= -95 && signal < -80) {
        stopGesture = 1
        if (stopSignal != 1) {
            basic.showLeds(`
                . . # . .
                . . # . .
                . . # . .
                . . . . .
                . . # . .
                `)
            basic.pause(100)
        }
    } else if (signal >= -80 && signal <= -42) {
        if (stopSignal != 1) {
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `)
            basic.pause(100)
        }
        music.playMelody("C5 - C5 - C5 - C5 - ", 300)
    } else {
        stopGesture = 0
    }
    basic.clearScreen()
    basic.pause(100)
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    temp = input.temperature()
    basic.showNumber(temp)
    bodyTemp = MLX90614.temperature(MLX90614_TEMPERATURE_ORIGIN.OBJECT)
    basic.showNumber(bodyTemp)
})
let warning = 0
let position: number[] = []
let temperature = 0
let temp = 0
let stopSignal = 0
let stopGesture = 0
let signal = 0
let bodyTemp = 0
bodyTemp = 0
radio.setGroup(145)
radio.setTransmitPower(0.2)
basic.forever(function () {
    radio.sendString("TOO CLOSE")
    basic.pause(100)
})
basic.forever(function () {
    temperature = input.temperature()
    if (input.temperature() <= 23) {
        stopSignal = 1
        music.playMelody("G B A G C5 B A B ", 250)
        basic.showString("BAD TEMP", 85)
    } else {
        stopSignal = 0
    }
})
basic.forever(function () {
    if (input.buttonIsPressed(Button.A)) {
        basic.showIcon(IconNames.Yes)
        position = []
        for (let index = 0; index <= 10; index++) {
            position.push(input.acceleration(Dimension.Y) + index)
            position.push(input.acceleration(Dimension.Y) - index)
        }
    }
    if (input.buttonIsPressed(Button.B)) {
        if (warning == 0) {
            warning = 1
            basic.showString("WARNING ON!", 80)
        } else {
            warning = 0
            basic.showString("WARNING OFF!", 80)
        }
    }
    for (let value of position) {
        if (value == input.acceleration(Dimension.Y)) {
            if (warning == 0) {
                pins.digitalWritePin(DigitalPin.P2, 1)
                basic.pause(500)
            } else {
                music.playMelody("G B A G C5 B A B ", 250)
                basic.showIcon(IconNames.Angry)
            }
        } else {
            pins.digitalWritePin(DigitalPin.P2, 0)
            basic.clearScreen()
        }
    }
})

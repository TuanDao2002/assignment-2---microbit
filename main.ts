radio.onReceivedString(function (receivedString) {
    signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    music.setVolume(Math.map(signal, -95, -42, 0, 250))
    if (signal < -68.5 && signal >= -95) {
        stopGesture = 1
        if (stopSignal != 1) {
            basic.showLeds(`
                . . # . .
                . . # . .
                . . # . .
                . . . . .
                . . # . .
                `)
        }
        music.playMelody("G B G E G A G - ", 250)
    } else if (signal < -42 && signal >= -68.5) {
        if (stopSignal != 1) {
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `)
        }
        music.playMelody("C5 - C5 - C5 - C5 - ", 300)
    } else {
        stopGesture = 0
    }
    basic.pause(200)
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    temperature = input.temperature()
    basic.showNumber(temperature)
})
let position: number[] = []
let temperature = 0
let stopSignal = 0
let stopGesture = 0
let signal = 0
let warning = 0
radio.setGroup(123)
radio.setTransmitPower(2)
basic.forever(function () {
    radio.sendString("TOO CLOSE")
    basic.pause(200)
})
basic.forever(function () {
    temperature = input.temperature()
    if (input.temperature() <= 18) {
        stopSignal = 1
        music.playMelody("A F E F D G E F ", 180)
        basic.showString("BAD TEMP")
    } else {
        stopSignal = 0
    }
})
basic.forever(function () {
    if (input.buttonIsPressed(Button.A)) {
        basic.showIcon(IconNames.Yes)
        position = []
        for (let index = 0; index <= 5; index++) {
            position.push(input.acceleration(Dimension.Y) + index)
            position.push(input.acceleration(Dimension.Y) - index)
        }
    }
    if (input.buttonIsPressed(Button.B)) {
        if (warning == 0) {
            warning = 1
        } else {
            warning = 0
        }
    }
    for (let value of position) {
        if (value == input.acceleration(Dimension.Y)) {
            if (warning == 0) {
                pins.digitalWritePin(DigitalPin.P2, 1)
                basic.pause(500)
            } else {
                basic.showIcon(IconNames.Angry)
            }
        } else {
            pins.digitalWritePin(DigitalPin.P2, 0)
            basic.clearScreen()
        }
    }
})

radio.onReceivedString(function (receivedString) {
    signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    music.setVolume(Math.map(signal, -95, -42, 0, 250))
    if (signal >= -95 && signal < -75) {
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
    } else if (signal >= -75 && signal <= -42) {
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
    bodyTemp = MLX90614.temperature(MLX90614_TEMPERATURE_ORIGIN.OBJECT)
    basic.showString("BODY:", 90)
basic.showNumber(bodyTemp)
    temp = input.temperature()
    basic.showString("ROOM:", 90)
basic.showNumber(temp)
})
let temperature = 0
let position: number[] = []
let gestureStatus = 0
let warning = 0
let temp = 0
let bodyTemp = 0
let stopSignal = 0
let stopGesture = 0
let signal = 0
radio.setGroup(145)
radio.setTransmitPower(0.2)
basic.forever(function () {
    if (input.buttonIsPressed(Button.B)) {
        if (warning == 0) {
            music.playTone(262, music.beat(BeatFraction.Whole))
            warning = 1
            gestureStatus = 1
            basic.showString("WARNING ON!", 90)
        } else {
            music.playTone(131, music.beat(BeatFraction.Whole))
            warning = 0
            gestureStatus = 0
            basic.showString("WARNING OFF!", 90)
        }
    }
    if (gestureStatus == 1 && stopGesture == 0) {
        if (input.buttonIsPressed(Button.A)) {
            music.playTone(392, music.beat(BeatFraction.Whole))
            basic.showIcon(IconNames.Yes)
            position = []
            for (let index = 0; index <= 10; index++) {
                position.push(input.acceleration(Dimension.Y) + index)
                position.push(input.acceleration(Dimension.Y) - index)
            }
        }
        for (let value of position) {
            if (value == input.acceleration(Dimension.Y)) {
                if (warning == 1) {
                    music.playMelody("G B A G C5 B A B ", 250)
                }
                basic.showIcon(IconNames.Angry)
                basic.pause(200)
                basic.clearScreen()
            }
        }
    }
})
basic.forever(function () {
    radio.sendString("TOO CLOSE")
    basic.pause(100)
})
basic.forever(function () {
    temperature = input.temperature()
    if (input.temperature() <= 24) {
        stopSignal = 1
        music.playMelody("G B A G C5 B A B ", 250)
        basic.showString("BAD TEMP!", 90)
    } else {
        stopSignal = 0
    }
})

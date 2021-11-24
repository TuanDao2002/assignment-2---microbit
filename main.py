def on_received_string(receivedString):
    global signal, stopGesture
    signal = radio.received_packet(RadioPacketProperty.SIGNAL_STRENGTH)
    music.set_volume(Math.map(signal, -95, -42, 0, 250))
    if signal < -68.5 and signal >= -95:
        stopGesture = 1
        if stopSignal != 1:
            basic.show_leds("""
                . . # . .
                                . . # . .
                                . . # . .
                                . . . . .
                                . . # . .
            """)
        music.play_melody("G B G E G A G - ", 250)
    elif signal < -42 and signal >= -68.5:
        if stopSignal != 1:
            basic.show_leds("""
                # . . . #
                                . # . # .
                                . . # . .
                                . # . # .
                                # . . . #
            """)
        music.play_melody("C5 - C5 - C5 - C5 - ", 300)
    else:
        stopGesture = 0
    basic.pause(200)
radio.on_received_string(on_received_string)

def on_logo_pressed():
    global temperature
    temperature = input.temperature()
    basic.show_number(temperature)
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_pressed)

position: List[number] = []
temperature = 0
stopSignal = 0
stopGesture = 0
signal = 0
warning = 0
radio.set_group(123)
radio.set_transmit_power(2)

def on_forever():
    radio.send_string("TOO CLOSE")
    basic.pause(200)
basic.forever(on_forever)

def on_forever2():
    global temperature, stopSignal
    temperature = input.temperature()
    if input.temperature() <= 18:
        stopSignal = 1
        music.play_melody("A F E F D G E F ", 180)
        basic.show_string("BAD TEMP")
    else:
        stopSignal = 0
basic.forever(on_forever2)

def on_forever3():
    global position, warning
    if input.button_is_pressed(Button.A):
        basic.show_icon(IconNames.YES)
        position = []
        for index in range(6):
            position.append(input.acceleration(Dimension.Y) + index)
            position.append(input.acceleration(Dimension.Y) - index)
    if input.button_is_pressed(Button.B):
        if warning == 0:
            warning = 1
        else:
            warning = 0
    for value in position:
        if value == input.acceleration(Dimension.Y):
            if warning == 0:
                pins.digital_write_pin(DigitalPin.P2, 1)
                basic.pause(500)
            else:
                basic.show_icon(IconNames.ANGRY)
        else:
            pins.digital_write_pin(DigitalPin.P2, 0)
            basic.clear_screen()
basic.forever(on_forever3)

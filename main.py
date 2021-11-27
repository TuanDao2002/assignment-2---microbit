def on_received_string(receivedString):
    global signal, stopGesture
    signal = radio.received_packet(RadioPacketProperty.SIGNAL_STRENGTH)
    music.set_volume(Math.map(signal, -95, -42, 0, 250))
    if signal >= -95 and signal < -80:
        stopGesture = 1
        if stopSignal != 1:
            basic.show_leds("""
                . . # . .
                                . . # . .
                                . . # . .
                                . . . . .
                                . . # . .
            """)
            basic.pause(100)
    elif signal >= -80 and signal <= -42:
        if stopSignal != 1:
            basic.show_leds("""
                # . . . #
                                . # . # .
                                . . # . .
                                . # . # .
                                # . . . #
            """)
            basic.pause(100)
        music.play_melody("C5 - C5 - C5 - C5 - ", 300)
    else:
        stopGesture = 0
    basic.clear_screen()
    basic.pause(100)
radio.on_received_string(on_received_string)

def on_logo_pressed():
    global temp, bodyTemp
    temp = input.temperature()
    basic.show_number(temp)
    bodyTemp = MLX90614.temperature(MLX90614_TEMPERATURE_ORIGIN.OBJECT)
    basic.show_number(bodyTemp)
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_pressed)

warning = 0
position: List[number] = []
temperature = 0
temp = 0
stopSignal = 0
stopGesture = 0
signal = 0
bodyTemp = 0
bodyTemp = 0
radio.set_group(145)
radio.set_transmit_power(0.2)

def on_forever():
    radio.send_string("TOO CLOSE")
    basic.pause(100)
basic.forever(on_forever)

def on_forever2():
    global temperature, stopSignal
    temperature = input.temperature()
    if input.temperature() <= 23:
        stopSignal = 1
        music.play_melody("G B A G C5 B A B ", 250)
        basic.show_string("BAD TEMP", 95)
    else:
        stopSignal = 0
basic.forever(on_forever2)

def on_forever3():
    global position, warning
    if input.button_is_pressed(Button.A):
        basic.show_icon(IconNames.YES)
        position = []
        for index in range(11):
            position.append(input.acceleration(Dimension.Y) + index)
            position.append(input.acceleration(Dimension.Y) - index)
    if input.button_is_pressed(Button.B):
        if warning == 0:
            warning = 1
            basic.show_string("WARNING ON!", 80)
        else:
            warning = 0
            basic.show_string("WARNING OFF!", 80)
    for value in position:
        if value == input.acceleration(Dimension.Y):
            if warning == 0:
                pins.digital_write_pin(DigitalPin.P2, 1)
                basic.pause(500)
            else:
                music.play_melody("G B A G C5 B A B ", 250)
                basic.show_icon(IconNames.ANGRY)
        else:
            pins.digital_write_pin(DigitalPin.P2, 0)
            basic.clear_screen()
basic.forever(on_forever3)

def on_received_string(receivedString):
    global signal
    signal = radio.received_packet(RadioPacketProperty.SIGNAL_STRENGTH)
    music.set_volume(Math.map(signal, -95, -42, 0, 250))
    if signal < -68.5 and signal >= -95:
        if stopSignal != 1:
            basic.show_leds("""
                . . # . .
                                . . # . .
                                . . # . .
                                . . . . .
                                . . # . .
            """)
        music.play_melody("C5 - C5 - C5 - C5 - ", 300)
    else:
        if stopSignal != 1:
            basic.show_leds("""
                # . . . #
                                . # . # .
                                . . # . .
                                . # . # .
                                # . . . #
            """)
        music.play_melody("C5 C5 C5 C5 C5 C5 C5 C5 ", 300)
    basic.pause(200)
radio.on_received_string(on_received_string)

temperature = 0
stopSignal = 0
signal = 0
radio.set_group(1)
radio.set_transmit_power(1)

def on_forever():
    radio.send_string("TOO CLOSE")
    basic.pause(200)
basic.forever(on_forever)

def on_forever2():
    global temperature, stopSignal
    temperature = input.temperature()
    if input.temperature() <= 22:
        stopSignal = 1
        basic.show_number(temperature)
        basic.show_string("BAD TEMP")
    else:
        stopSignal = 0
basic.forever(on_forever2)

def on_forever3():
    pass
basic.forever(on_forever3)

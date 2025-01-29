import board
import neopixel
import asyncio
import websockets
import json
# LED setup
num_pixels = 24
pixels = neopixel.NeoPixel(board.D21, num_pixels, pixel_order=neopixel.RGB)

# WebSocket connection
websocket_connection = None

async def connect(uri):
    """Establish the WebSocket connection."""
    global websocket_connection
    try:
        websocket_connection = await websockets.connect(uri)
        print(f"Connected to {uri}")
    except Exception as e:
        print(f"Failed to connect to {uri}: {e}")

async def send_message(message):
    """Send a message over the WebSocket connection."""
    global websocket_connection
    if websocket_connection is None:
        print("Connection not established. Cannot send message.")
        return
    try:
                # Create the JSON object
        json_payload = {
            "type": "wheel-active-led",
            "data": message  # The `message` variable you want to send
        }
        
        # Convert the JSON object to a string
        json_string = json.dumps(json_payload)
        
        await websocket_connection.send(json_string)  
    except Exception as e:
        print(f"Error sending message: {e}")

async def lighthouse_effect(wait):
    """Lighthouse effect where one LED is red and the rest are blue."""
    global websocket_connection
    red_color = (255, 0, 0)
    blue_color = (0, 0, 255)

    while True:
        for i in range(num_pixels):
            # Set all LEDs to blue
            pixels.fill(blue_color)

            # Set the current LED to red
            pixels[i] = red_color
            pixels.show()

            # Send the current LED states as a WebSocket message
            led_states = [pixels[j] for j in range(num_pixels)]
            await send_message(str(led_states))

            # Wait before moving to the next LED
            await asyncio.sleep(wait)

async def main():
    """Main function to handle WebSocket and LED tasks."""
    uri = "ws://localhost"  # Replace with your server's URL
    await connect(uri)

    if websocket_connection:
        # Send a test message
        # await send_message("Lighthouse effect started")

        # Start the lighthouse effect
        await lighthouse_effect(0.15)  # 100ms delay for the animation

# Run the script
asyncio.run(main())


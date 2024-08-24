// main.js

// Function to decode and decompress telemetry data
function decodeTelemetry(encodedData) {
    try {
        // Remove any non-base64 characters from the string
        const sanitizedData = encodedData.replace(/[^A-Za-z0-9+/=]/g, '');

        // Decode the base64 string to binary data
        const binaryData = atob(sanitizedData);

        // Convert the binary data to a Uint8Array
        const binaryArray = Uint8Array.from(binaryData, (char) => char.charCodeAt(0));

        // Decompress the binary array using pako
        const decompressedData = pako.inflateRaw(binaryArray, { to: 'string' });

        return decompressedData;
    } catch (error) {
        console.error('Error during decoding or decompression:', error);
        return null;
    }
}

// Function to parse telemetry data into a JSON object
function parseTelemetry(dataString) {
    try {
        const data = JSON.parse(dataString);
        return data; // Ensure this structure matches your expected data format
    } catch (error) {
        console.error('Error parsing telemetry data:', error);
        return null;
    }
}

// Function to render a car on the circuit map
function renderCar(position) {
    const circuitMap = document.getElementById("circuit-map");
    const car = document.createElement("div");
    car.className = "car";
    car.style.left = position.x + "px";
    car.style.top = position.y + "px";
    circuitMap.appendChild(car);
}

// Function to update the slider based on current index
function updateSlider(currentIndex, totalLength) {
    const slider = document.getElementById('time-slider');
    const percentage = (currentIndex / (totalLength - 1)) * 100;
    slider.value = percentage;
}

// Function to initialize and play the race
function playRace(telemetryData) {
    let index = 0;
    let playing = false;
    let interval;

    function renderNextFrame() {
        if (index >= telemetryData.length) {
            clearInterval(interval);
            return;
        }
        const dataPoint = telemetryData[index];
        renderCar({ x: dataPoint.x, y: dataPoint.y });
        index++;
        updateSlider(index, telemetryData.length);
    }

    function startRace() {
        if (!playing) {
            interval = setInterval(renderNextFrame, 1000);
            playing = true;
        }
    }

    function pauseRace() {
        clearInterval(interval);
        playing = false;
    }

    function stopRace() {
        clearInterval(interval);
        playing = false;
        index = 0;
        document.querySelectorAll('.car').forEach(car => car.remove());
        updateSlider(index, telemetryData.length);
    }

    document.getElementById('play').addEventListener('click', startRace);
    document.getElementById('pause').addEventListener('click', pauseRace);
    document.getElementById('stop').addEventListener('click', stopRace);
    
    document.getElementById('time-slider').addEventListener('input', (event) => {
        clearInterval(interval);
        const sliderValue = event.target.value;
        index = Math.floor(sliderValue / 100 * telemetryData.length);
        document.querySelectorAll('.car').forEach(car => car.remove());
        for (let i = 0; i < index; i++) {
            const dataPoint = telemetryData[i];
            renderCar({ x: dataPoint.x, y: dataPoint.y });
        }
    });
}

// Function to fetch and process the jsonStream file
async function fetchAndProcessTelemetry(file) {
    try {
        const response = await fetch(file);
        const fileText = await response.text();

        const telemetryData = fileText.split("\n").map(line => {
            if (!line.trim()) return null; // Skip empty lines
            const [timestamp, encodedData] = line.split('"');
            const decodedData = decodeTelemetry(encodedData);
            if (decodedData) {
                return parseTelemetry(decodedData);
            }
            return null;
        }).filter(data => data !== null);

        playRace(telemetryData);
    } catch (error) {
        console.error('Error fetching or processing telemetry file:', error);
    }
}

// Call function to fetch and process the telemetry data
fetchAndProcessTelemetry('Emilia2021.jsonStream');

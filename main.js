// main.js

// Example of a base64 encoded and compressed telemetry data snippet
const telemetrySnippet = [
    "00:00:03.712\"1ZixbhsxDIbfRbNTkBQlircGfYN2adEhKAK0QOEhzWb43XOW5EKJGJ8t5JxmsQHhfov6SX7ieec+bx8fft//ddP3nfv6+NNNjoDwBvgG0xekycME/hMgeAL85jbu9u5hfnrn/OHj9tfddnv/Jy+AmxBVeOPITeRhc3gkbBy7SXXjgpvmJZ6/cL/Pq50csrQIIT8CnS5Y2wJHzVoUzGrO6oCdPBpyCVh2TimLqdkaoVWLoQ4BJKu5qPGVwNXQsk/FrnDyzAiDZiEaQh8Cn6O1MpQ8YjEa/IJXaFndBz3nroq5FSdDHAP6rNdil88/QG3kcBATDdrlLbuSaCxHRm22ldjL7ZaIVGqTgmR9rOfu92fLcsaqR+yCf+44W+VZzs2ne8pqqnNTFa1TJ380LaaGA2ZPWVEjKNdCE9+4rr3rajXWcrZn6SngUQBKPi0Dj/EIvHBN4AlAtSe0wOvlNvC0NFKSpomRO7HJO4+Vd3I574jh+rzzRMO8g1i0unQ1rIA7krp32wEv9l4VeDQGPKJYgZeGgAeHe/hw7o/DO0UoucIKeb6Qd7NphSOY2gnGMm0d4LEC8TLvQOqkRb5N7uq8S3zknQzwTqwBj/rp0OQdxlpTYWC+8/oOvKspGuDdnN1nI1Zxyvfit6cdcIlaoaPdeqxTqQM4+hay0pezzTrgUPqeYmlbuZR1obAufhzWJaISM3IYY13gesHo+7BO/LxIYRl2WkcdYrwi7GYjqj8JRmAndbjTFnZ9D1u54SS1qPhy2GGdlXrYvRiV3hZ3UYdfZ0UgFOhg41Wf3hVxV0fw6+AO53G2llb9t6K+VvVX4Wu8O77ujPKO5Kwa+Y94p/jvjsAx3kn9hwg1rsW7H/sn"
    // Add more data snippets as needed
];

// Function to decode and decompress telemetry data
function decodeTelemetry(encodedData) {
    const compressedData = atob(encodedData);
    const decompressedData = pako.inflateRaw(compressedData, { to: 'string' });
    return decompressedData;
}

// Function to parse telemetry data into a JSON object
function parseTelemetry(dataString) {
    const data = JSON.parse(dataString);
    // Transform data as needed, depending on its structure
    return data;
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

// Function to initialize and play the race
function playRace() {
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
        updateSlider(index);
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
        updateSlider(index);
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

// Initialize telemetry data and start the player
const telemetryData = telemetrySnippet.map(snippet => {
    const [timestamp, encodedData] = snippet.split('"');
    const decodedData = decodeTelemetry(encodedData);
    return parseTelemetry(decodedData);
});

playRace();

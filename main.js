// main.js

// Mock function to simulate decoded telemetry data
function getTelemetryData() {
    // Replace this with actual telemetry data decoding logic
    return [
        {"timestamp": "00:00:03.712", "x": 100, "y": 200},
        {"timestamp": "00:00:04.912", "x": 120, "y": 230},
        {"timestamp": "00:00:05.911", "x": 150, "y": 250},
        {"timestamp": "00:00:06.911", "x": 180, "y": 270},
        {"timestamp": "00:00:07.832", "x": 200, "y": 290},
        {"timestamp": "00:00:09.032", "x": 220, "y": 310},
        {"timestamp": "00:00:10.952", "x": 240, "y": 330},
        {"timestamp": "00:00:11.911", "x": 260, "y": 350},
        {"timestamp": "00:00:12.871", "x": 280, "y": 370},
        {"timestamp": "00:00:14.071", "x": 300, "y": 390},
        {"timestamp": "00:00:15.032", "x": 320, "y": 410},
        {"timestamp": "00:00:16.952", "x": 340, "y": 430},
        {"timestamp": "00:00:18.152", "x": 360, "y": 450},
        {"timestamp": "00:00:19.111", "x": 380, "y": 470}
        // ...more data points
    ];
}

const telemetryData = getTelemetryData();
const circuitMap = d3.select("#circuit-map");

let interval; // to store the setInterval reference
let playing = false; // to track the playing state
let currentIndex = 0; // to track the current data index

// Function to render a car at a specific position
function renderCar(position) {
    circuitMap.append("div")
        .attr("class", "car")
        .style("left", position.x + "px")
        .style("top", position.y + "px");
}

// Function to start or continue playing the race
function playRace() {
    if (!playing) {
        interval = setInterval(() => {
            if (currentIndex >= telemetryData.length) {
                clearInterval(interval);
                playing = false;
                return;
            }
            const dataPoint = telemetryData[currentIndex];
            renderCar({ x: dataPoint.x, y: dataPoint.y });
            currentIndex++;
            updateSlider(); // Update slider position as the race plays
        }, 1000); // Playback speed (adjust as needed)
        playing = true;
    }
}

// Function to pause the race playback
function pauseRace() {
    clearInterval(interval);
    playing = false;
}

// Function to stop the race playback and reset
function stopRace() {
    clearInterval(interval);
    playing = false;
    currentIndex = 0;
    d3.selectAll('.car').remove(); // Clear all cars from the map
    updateSlider(); // Reset slider position
}

// Function to update the slider based on current index
function updateSlider() {
    const slider = document.getElementById('time-slider');
    const percentage = (currentIndex / (telemetryData.length - 1)) * 100;
    slider.value = percentage;
}

// Event listeners for control buttons
document.getElementById('play').addEventListener('click', playRace);
document.getElementById('pause').addEventListener('click', pauseRace);
document.getElementById('stop').addEventListener('click', stopRace);

// Event listener for slider input to seek in race data
document.getElementById('time-slider').addEventListener('input', (event) => {
    clearInterval(interval);
    playing = false;
    d3.selectAll('.car').remove(); // Clear all cars from the map
    const sliderValue = event.target.value;
    currentIndex = Math.floor(sliderValue / 100 * (telemetryData.length - 1));
    for (let i = 0; i <= currentIndex; i++) {
        const dataPoint = telemetryData[i];
        renderCar({ x: dataPoint.x, y: dataPoint.y });
    }
});

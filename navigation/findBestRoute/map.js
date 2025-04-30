import { pythonURI, javaURI, fetchOptions, login } from '../../assets/js/api/config.js';

document.getElementById('fetch_routes_btn').addEventListener('click', () => {
    fetchRoutes();
});

async function fetchRoadData() {
    try {
        const response = await fetch('https://opendata.sandag.org/resource/ewu3-gvdq.json');
        return await response.json();
    } catch (error) {
        console.error('Error fetching road data:', error);
        return [];
    }
}

async function fetchRoutes() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const resultDiv = document.getElementById('result');

    resultDiv.innerHTML = 'Loading...';

    try {
        const roadData = await fetchRoadData();
        const response = await fetch(`${pythonURI}/api/get_routes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ origin, destination })
        });
        const data = await response.json();

        if (Array.isArray(data)) {
            resultDiv.innerHTML = '';
            const currentHour = new Date().getHours();
            const isAM = currentHour < 12;

            data.forEach((route, index) => {
                const routeEl = document.createElement('div');
                const updatedDetails = route.details.map(step => {
                    const matchingRoad = roadData.find(road =>
                        road.street_name && step.instruction.includes(road.street_name)
                    );

                    if (matchingRoad) {
                        const avgSpeed = isAM
                            ? parseFloat(matchingRoad._2023_am_peak_period_mean)
                            : parseFloat(matchingRoad._2023_pm_peak_period_mean);

                        if (avgSpeed && !isNaN(avgSpeed)) {
                            const distanceInMiles = parseFloat(step.distance.split(' ')[0]); // Assuming "X mi" format
                            const updatedDuration = (distanceInMiles / avgSpeed) * 60; // Convert hours to minutes
                            return {
                                ...step,
                                duration: `${updatedDuration.toFixed(2)} mins`
                            };
                        }
                    }
                    return step;
                });

                routeEl.innerHTML = `
                    <h3>Route ${index + 1}</h3>
                    <p><strong>Total Distance:</strong> ${route.total_distance}</p>
                    <p><strong>Total Duration:</strong> ${route.total_duration}</p>
                    <ol>
                      ${updatedDetails.map(step => `
                        <li>${step.instruction} (${step.distance}, ${step.duration})</li>
                      `).join('')}
                    </ol>
                    <hr>
                `;
                resultDiv.appendChild(routeEl);
            });
        } else {
            resultDiv.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
        }
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = '<p style="color:red;">Something went wrong while fetching routes.</p>';
    }
}
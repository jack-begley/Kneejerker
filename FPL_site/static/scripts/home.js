import { renderBarChart } from './chartUtils.js';
import { updateLastUpdatedTime, formatNumber, formatOwnership, isUserActive, callUpdateEndpoint, truncateLabel } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    const pills = document.querySelectorAll('.pill');
    const charts = document.querySelectorAll('.chart');
    const lastUpdatedTime = document.getElementById('last-updated-time');
    const descriptions = {
        'net-transfers-in': document.getElementById('description-net-transfers-in'),
        'net-transfers-out': document.getElementById('description-net-transfers-out'),
        'relative-ownership': document.getElementById('description-relative-ownership')
    };
    const chartInstances = {};
    let lastUpdatedTimestamp = Date.now();

    function initializeChartClickHandling(chartInstance, sortedData) {
        let selectedIndex = null;

        // Ensure the click event is set up correctly
        chartInstance.off('click'); // Clear any previous event listeners
        chartInstance.on('click', function (params) {
            // Check if the click is on the series, which includes the bars and associated labels
            if (params.componentType === 'series' || params.componentType === 'label') {
                console.log('Clicked on:', params.name, 'with ID:', sortedData[params.dataIndex].id);

                selectedIndex = params.dataIndex;

                // Update the colors: Selected bar becomes primary color, others become the default
                chartInstance.setOption({
                    series: [{
                        itemStyle: {
                            color: function (params) {
                                return params.dataIndex === selectedIndex
                                    ? 'var(--primary-color)'
                                    : 'var(--black-20)';
                            }
                        }
                    }]
                });

                const playerId = sortedData[params.dataIndex].id;
                if (playerId) {
                    selectPlayer(playerId);
                } else {
                    console.error("Player ID is missing for the selected data point.");
                }
            }
        });

        // Handle hover states (optional)
        chartInstance.on('mousemove', function (params) {
            if (params.componentType === 'series' || params.componentType === 'label') {
                chartInstance.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: params.dataIndex,
                });
            }
        });

        chartInstance.on('mouseout', function () {
            chartInstance.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
            });
        });
    }



    function fetchChartData(url, chartId) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("Chart Data:", data);

                if (data.labels && data.labels.length > 0 && (data.values || (data.oldValues && data.newValues))) {
                    let sortedData, labels, values, formattedValues;

                    if (chartId === 'net-transfers-in') {
                        sortedData = data.labels.map((label, index) => ({
                            label: truncateLabel(label),
                            value: data.values[index],
                            id: data.ids ? data.ids[index] : null
                        })).sort((a, b) => a.value - b.value);

                        labels = sortedData.map(item => item.label);
                        values = sortedData.map(item => item.value);
                        formattedValues = sortedData.map(item => formatNumber(item.value));

                    } else if (chartId === 'net-transfers-out') {
                        sortedData = data.labels.map((label, index) => ({
                            label: truncateLabel(label),
                            value: data.values[index],
                            id: data.ids ? data.ids[index] : null
                        })).sort((a, b) => a.value - b.value);

                        labels = sortedData.map(item => item.label);
                        values = sortedData.map(item => item.value);
                        formattedValues = sortedData.map(item => formatNumber(-item.value)); // Make the values negative

                    } else if (chartId === 'relative-ownership') {
                        sortedData = data.labels.map((label, index) => ({
                            label: truncateLabel(label),
                            change: data.newValues[index] - data.oldValues[index],
                            id: data.ids ? data.ids[index] : null
                        })).sort((a, b) => a.change - b.change);

                        labels = sortedData.map(item => item.label);
                        values = sortedData.map(item => item.change);
                        formattedValues = sortedData.map(item => formatOwnership(
                            data.oldValues[data.labels.indexOf(item.label)],
                            data.newValues[data.labels.indexOf(item.label)]
                        ));
                    }

                    // Render the chart
                    renderBarChart(chartId, labels, values, formattedValues);

                    // Get the instance of the chart
                    const chartInstance = echarts.getInstanceByDom(document.getElementById(chartId));

                    if (chartInstance) {
                        initializeChartClickHandling(chartInstance, sortedData);
                    } else {
                        console.error("Chart instance not found for ID:", chartId);
                    }

                    lastUpdatedTimestamp = Date.now();
                    updateLastUpdatedTime();
                } else {
                    console.error("No data available for the chart.");
                }
            })
            .catch(error => console.error('Error fetching chart data:', error));
    }


    function selectPlayer(playerId) {
        Promise.all([
            fetch(`/get_player_summary?id=${playerId}`).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            }),
            fetch(`/get_next_5_fixtures?id=${playerId}`).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
        ])
        .then(([playerDataResponse, fixtures]) => {
            if (Array.isArray(playerDataResponse) && playerDataResponse.length > 0) {
                const playerData = playerDataResponse[0]; // Extract the player data from the array
                console.log("Received player data:", playerData);
    
                if (!playerData || !playerData.metrics || !Array.isArray(playerData.metrics)) {
                    console.error("Invalid player data received:", playerData);
                } else {
                    playerData.fixtures = fixtures; // Ensure fixtures are correctly added to playerData
                    populatePlayerSummary(playerData);
                    updateFixtureDetails(playerData);
                }
            } else {
                console.error("Unexpected response format:", playerDataResponse);
            }
        })
        .catch(error => console.error('Error fetching player data:', error));
    }
    
    function populatePlayerSummary(player) {
        const carouselIndicators = document.getElementById('carouselIndicators');
        const summaryCarouselInner = document.getElementById('summaryCarouselInner');
    
        if (!carouselIndicators || !summaryCarouselInner) {
            console.error("Carousel elements not found in the DOM.");
            return;
        }
    
        if (!player || !player.metrics || !Array.isArray(player.metrics)) {
            console.error("Invalid player data provided.");
            return;
        }
    
        const metricGroups = [];
        const metricsPerGroup = 3;
    
        // Split metrics into groups of 3
        for (let i = 0; i < player.metrics.length; i += metricsPerGroup) {
            metricGroups.push(player.metrics.slice(i, i + metricsPerGroup));
        }
    
        // Generate carousel indicators
        carouselIndicators.innerHTML = metricGroups.map((_, index) => `
            <button type="button" data-bs-target="#summaryCarousel" data-bs-slide-to="${index}" ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
        `).join('');
    
        // Generate carousel items
        summaryCarouselInner.innerHTML = metricGroups.map((group, groupIndex) => `
            <div class="carousel-item ${groupIndex === 0 ? 'active' : ''}">
                <div class="heading-row">
                    ${group.map(metric => `<div class="measure-title">${metric.title}</div>`).join('')}
                </div>
                <div class="player-values">
                    ${group.map(metric => `<div class="measure-values">${metric.value}</div>`).join('')}
                </div>
                <div class="average-values">
                    ${group.map(metric => `<div class="average-values">${metric.averageValue}</div>`).join('')}
                </div>
            </div>
        `).join('');
    
        // Reinitialize the carousel
        const myCarousel = document.querySelector('#summaryCarousel');
        if (myCarousel) {
            const carouselInstance = bootstrap.Carousel.getInstance(myCarousel);
            if (carouselInstance) {
                carouselInstance.dispose();  // Dispose of the previous instance
            }
            new bootstrap.Carousel(myCarousel);  // Reinitialize the carousel
        }
    
        // Update player name, shirt, and team
        document.getElementById('player-summary-name').textContent = player.name || 'Unknown';
        document.getElementById('player-value').textContent = "\u00A3" + player.value || '�-.-';
        document.getElementById('minutes').textContent = player.minutes || '-';
        document.getElementById('position-name').textContent = player.position_name || 'Position';
        document.querySelector('.coat-hanger .shirt').src = player.shirtImage || '/static/content/Tshirts/unknown-football-shirt-svgrepo-com.svg';
        document.querySelector('.coat-hanger .player-team-name').textContent = player.team_name || '-';
    }
    
    function updateFixtureDetails(player) {
        if (!player.fixtures || !Array.isArray(player.fixtures)) {
            console.error("Invalid fixtures data provided.");
            return;
        }
    
        player.fixtures.forEach((fixture, index) => {
            const fixtureElement = document.getElementById(`fixture-${index + 1}`);
            if (fixtureElement) {
                fixtureElement.className = `difficulty-${fixture.difficulty}`;
                fixtureElement.textContent = fixture.teamName;
    
                const shirtElement = document.querySelector(`.team-shirts .coat-hanger:nth-child(${index + 1}) .shirt`);
                if (shirtElement) {
                    shirtElement.src = fixture.shirtImage;
                    if (fixture.difficulty === 0) {
                        shirtElement.classList.add('no-fixture')
                    }
                }
    
                const venueElement = document.querySelector(`.venue-row .venue:nth-child(${index + 1})`);
                if (venueElement) {
                    venueElement.textContent = fixture.homeOrAway;
                    venueElement.className = fixture.homeOrAway.toLowerCase();
                }
            }
        });
    }
    
    function initializeCharts() {
        fetchChartData('/api/net-transfers-in', 'net-transfers-in');
        fetchChartData('/api/net-transfers-out', 'net-transfers-out');
        fetchChartData('/api/relative-ownership', 'relative-ownership');
    }

    pills.forEach(pill => {
        pill.addEventListener('click', function () {
            pills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            charts.forEach(chart => chart.classList.remove('active'));
            Object.values(descriptions).forEach(desc => {
                if (desc) {
                    desc.style.display = 'none';
                }
            });

            const target = document.getElementById(this.dataset.target);
            if (target) {
                target.classList.add('active');
                descriptions[this.dataset.target].style.display = 'block';
                fetchChartData(`/api/${this.dataset.target}`, this.dataset.target);
            } else {
                console.error(`Target element for ${this.dataset.target} not found.`);
            }

            // Ensure chart is resized properly
            Object.keys(chartInstances).forEach(chartId => {
                chartInstances[chartId]?.resize();
            });
        });
    });

    initializeCharts();
    isUserActive(initializeCharts);

    window.addEventListener('resize', function () {
        Object.keys(chartInstances).forEach(chartId => {
            chartInstances[chartId]?.resize();
        });
    });

    setInterval(updateLastUpdatedTime, 30000);

});

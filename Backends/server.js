import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

async function getCoordinates(city) {
    const geocondingUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

    try {
        const response = await axios.get(geocondingUrl);
        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { lat, lon };
        } else {
            throw new Error('City not found');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }

}

async function getRecommendationSpots(city) {
    const coordinates = await getCoordinates(city);

    if (!coordinates) {
        console.log('Unable to get coordinates for the city.');
        return;
    }

    const { lat, lon } = coordinates;
    const url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&radius=5000&limit=10`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: 'fsq3d34DcmaxqZfGM+laKQWWuidaar6Gubqr5snaBTLdWM4=',
            },
        });

        const places = response.data.results;
        if (places.length > 0) {
            console.log(`Recommended spots in ${city}:`);
            places.forEach((place, index) => {
                console.log(`${index + 1}. ${place.name} - ${place.location.formatted_address}`);
            });
            return places;
        }
        else {
            console.log(`No spots found in ${city}.`);
        }
    } catch (error) {
        console.error('Error fetching recommended spots:', error);
    }
}

const getDistancesForSpots = async (spots) => {
    const apiKey = "AIzaSyCWGKu7hvtqqlcTf3Prxm25uj_mPTashDw";
    const results = [];

    for (let i = 0; i < spots.length; i++) {
        const origin = spots[i];
        const destinations = spots.filter((_, index) => index !== i);

        const destinationLatLng = destinations.map(spot => `${spot.lat},${spot.lng}`).join('|');
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destinationLatLng}&key=${apiKey}`;


        try {
            const response = await axios.get(url);

            response.data.rows[0].elements.forEach((element, j) => {
                const destination = destinations[j]
                const distance = element ? element.distance.text : "N/A";
                const duration = element ? element.duration.text : "N/A";

                results.push({
                    origin: origin.name,
                    destination: destination.name,
                    distance,
                    duration,
                });

            });
        } catch (error) {
            console.error("Error fetching distance:", error);
            destinations.forEach(destination => {
                results.push({
                    origin: origin.name,
                    destination: destination.name,
                    distance: "N/A",
                    duration: "N/A",
                });

            });
        }
    }

return results;
}

function filterByRating(spots) {
    return spots.filter(spot => spot.rating >= 7);
}

function groupsSpotsByProximity(spots, distanceMatrix, maxDuration = 40) {
    const groupedSpots = [];
    const visitedSpots = new Set();

    spots.forEach((spot) => {
        if (!visitedSpots.has(spot.fsq_id)) {
            const group = [spot];
            visitedSpots.add(spot.fsq_id);

            spots.forEach((neighbor) => {
                if (spot.fsq_id !== neighbor.fsq_id && !visitedSpots.has(neighbor.fsq_id)) {
                    const duration = distanceMatrix[spot.fsq_id][neighbor.fsq_id];

                    if (duration < maxDuration) {
                        group.push(neighbor);
                        visitedSpots.add(neighbor.fsq_id);
                    }
                }
            });

            groupedSpots.push(group);
        }
    });

    return groupedSpots;
}

function splitIntoGroupsOfThree(groups) {
    const result = [];
    groups.forEach(group => {
        while (group.length > 3) {
            result.push(group.slice(0, 3));
            group = group.slice(3);
        }

        if (group.length > 0) {
            result.push(group);
        }
    });

    return result;
}

app.post ('/generateItinerary', async (req, res) => {
    const {location, travelDate, travelDays } = req.body;

    if (!location || !travelDate || !travelDays) {
        return res.status(400).json({error: 'Location, travel date, and travel days are required'});
    }

    try {
        const itinerary = await generateItinerary(location, travelDays);
        return res.json ({ itinerary });
    } catch (error) {
        console.error('Error generating itinerary:', error);
        return res.status(500).json({error: 'Failed to generate itinerary'});
    }
});

async function generateItinerary(location, days) {
    const spots = await getRecommendationSpots(location);
    if (!spots || spots.length === 0) {
        console.log('No spots found for the location.');
        return [];
    }

    const filteredSpots = filterByRating(spots);
    const distanceMatrix = await getDistancesForSpots(filteredSpots);
    const groupedSpots = groupsSpotsByProximity(filteredSpots, distanceMatrix);

    const splitGroups = splitIntoGroupsOfThree(groupedSpots);

    const itinerary = [];
    let dayCounter = 0;

    splitGroups.forEach((group, index) => {
        if (dayCounter < days) {
            if (!itinerary[dayCounter]) {
                itinerary[dayCounter] = [];
            }
            itinerary[dayCounter].push(group);
            dayCounter++;
        }
    });

    while (dayCounter < days && splitGroups.length > 0) {
        if (!itinerary[dayCounter]) {
            itinerary[dayCounter] = [];
        }

        itinerary[dayCounter].push(splitGroups.shift());
        dayCounter++;
    }

    return itinerary;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})



var map = L.map("map").setView([27.7172, 85.324], 13); // Centered on Kathmandu

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var pickupMarker = L.marker([0, 0], { draggable: true }).addTo(map);
var destinationMarker = L.marker([0, 0], { draggable: true }).addTo(map);

// Create a routing control with your custom options
var control = L.Routing.control({
  waypoints: [
    L.latLng(27.7172, 85.324), // Initial waypoint (Kathmandu)
    L.latLng(27.7172, 85.324), // Initial waypoint (Kathmandu)
  ],
  routeWhileDragging: true,
}).addTo(map);

document
  .getElementById("distanceForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var pickup = document.getElementById("pickup").value + ", Kathmandu";
    var destination =
      document.getElementById("destination").value + ", Kathmandu";

    Promise.all([
      fetch(
        "https://nominatim.openstreetmap.org/search?q=" +
          pickup +
          "&format=json&viewbox=85.277498,27.666667,85.453415,27.741809"
      ).then((response) => response.json()),
      fetch(
        "https://nominatim.openstreetmap.org/search?q=" +
          destination +
          "&format=json&viewbox=85.277498,27.666667,85.453415,27.741809"
      ).then((response) => response.json()),
    ])
      .then(function (responses) {
        var pickupData = responses[0];
        var destinationData = responses[1];

        var pickupLat = pickupData[0].lat;
        var pickupLon = pickupData[0].lon;
        var destinationLat = destinationData[0].lat;
        var destinationLon = destinationData[0].lon;

        pickupMarker.setLatLng([pickupLat, pickupLon]);
        destinationMarker.setLatLng([destinationLat, destinationLon]);

        var waypoints = [
          L.latLng(pickupLat, pickupLon),
          L.latLng(destinationLat, destinationLon),
        ];

        control.setWaypoints(waypoints);

        var distance =
          pickupMarker.getLatLng().distanceTo(destinationMarker.getLatLng()) /
          1000; // in kilometers

        // Calculate fare based on distance
        var fare;
        if (distance <= 5) {
          fare = 20;
        } else if (distance > 5 && distance <= 10) {
          fare = 25;
        } else {
          fare = 30;
        }

        document.getElementById("result").innerHTML =
          "Distance: " + distance.toFixed(2) + " km<br>Fare: NPR " + fare;
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  });

document.addEventListener("DOMContentLoaded", function () {
  var map = L.map("map").setView([27.7017, 85.324], 13); // Centered on Maitighar, Kathmandu

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  var pickupMarker = L.marker([0, 0], { draggable: false });
  var destinationMarker = L.marker([0, 0], { draggable: false });

  var control = L.Routing.control({
    routeWhileDragging: true,
  }).addTo(map);

  var fare;
  var distance;
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

          pickupMarker.setLatLng([pickupLat, pickupLon]).addTo(map);
          destinationMarker
            .setLatLng([destinationLat, destinationLon])
            .addTo(map);

          var waypoints = [
            L.latLng(pickupLat, pickupLon),
            L.latLng(destinationLat, destinationLon),
          ];

          control.setWaypoints(waypoints);

          distance =
            pickupMarker.getLatLng().distanceTo(destinationMarker.getLatLng()) /
            1000; // in kilometers

          // Calculate fare based on distance
          if (distance <= 5) {
            fare = 20;
          } else if (distance > 5 && distance <= 10) {
            fare = 25;
          } else {
            fare = 30;
          }

          // Display the result and QR code divs
          document.getElementById("result").innerHTML =
            "Distance: " + distance.toFixed(2) + " km <br> Fare: NPR " + fare;

          // Call generateQR with the calculated fare amount
          generateQR(fare);

          // Hide form elements
          document.getElementById("distanceForm").style.display = "none";

          // Display the result and QR code divs
          document.getElementById("result").style.display = "block";
          document.getElementById("qr-code").style.display = "block";

          // scanQR(fare);
        })
        .catch(function (error) {
          console.error("Error:", error);
        });
    });

  function generateQR(fareAmount) {
    // Assuming you have a container with the id "qr-code" in your HTML where you want to display the QR code
    var qrCode = new QRCode("qr-code", {
      text: "reciept.html", // Fix the typo in the URL
      width: 128,
      height: 128,
    });

    // Get the QR code container element
    var qrCodeContainer = document.getElementById("qr-code");

    // Add a click event listener to the container
    qrCodeContainer.addEventListener("click", function () {
      // Replace "try.html" with the actual URL you want to open in the same tab
      document.getElementById("result").style.display = "none";
      document.getElementById("qr-code").style.display = "none";

      scanQR(fare);
      var newElement = document.createElement("div");

      // Set content for the new element
      newElement.innerHTML =
        "Distance: " +
        distance.toFixed(2) +
        " km <br> Fare: NPR " +
        fare +
        "<br> Pickup Location: " +
        document.getElementById("pickup").value +
        "<br> Destination: " +
        document.getElementById("destination").value +
        "<br> Remaining Balance: Rs " +
        balance;

      // Add a class to the new element
      newElement.classList.add("custom-result");

      // Append the new element to the document body or any other parent element
      document.body.appendChild(newElement);
    });
  }

  var balance = 500;
  document.getElementById("user-balance").innerHTML = "Balance: Rs " + balance;

  // Function to simulate scanning QR code and update balance
  function scanQR(fareAmount) {
    // Simulate processing transaction and updating balance
    balance -= fareAmount;
    document.getElementById("user-balance").innerHTML =
      "Balance: Rs " + balance;
  }
});

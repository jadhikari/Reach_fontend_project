import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapComponent = ({ plants }) => {
  // Check if there's valid plant data with latitude and longitude
  if (!plants || plants.length === 0) {
    return <p>No plant data available to display the map.</p>;
  }

  // Group plants by latitude and longitude
  const groupedPlants = plants.reduce((acc, plant) => {
    // Create a unique key using both latitude and longitude
    const latLngKey = `${plant.latitude}-${plant.longitude}`;

    // If no entry for this lat-lng combo, create an array for it
    if (!acc[latLngKey]) {
      acc[latLngKey] = [];
    }

    // Push the plant to the group of plants at this location
    acc[latLngKey].push(plant);

    return acc;
  }, {});

  return (
    <MapContainer
      center={[parseFloat(plants[0].latitude), parseFloat(plants[0].longitude)]} // Use the first plant's location to center the map
      zoom={7} // Zoom level adjusted for multiple locations
      style={{ height: "500px", width: "98%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* Render markers for each unique location */}
      {Object.keys(groupedPlants).map((key) => {
        const [latitude, longitude] = key.split("-");
        const plantsAtLocation = groupedPlants[key];

        return (
          <Marker key={key} position={[parseFloat(latitude), parseFloat(longitude)]}>
            <Popup>
              <div>
                <strong>Plants at this location:</strong>
                <ul>
                  {plantsAtLocation.map((plant) => (
                    <li key={plant.id}>
                      {plant.system_id} - {plant.system_name}
                    </li>
                  ))}
                </ul>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;

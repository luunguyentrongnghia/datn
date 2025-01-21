import { geocodeAddress } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
interface propMap {
  address: string;
}
const Map: React.FC<propMap> = ({ address }) => {
  const [coordinates, setCoordinates] = useState<{
    latitude: string;
    longitude: string;
  }>({
    latitude: "16.0471",
    longitude: "108.2062",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleCoordinates = async () => {
    try {
      setIsLoading(false);
      const CoordinatesData = await geocodeAddress(address);
      if (
        CoordinatesData.latitude !== null &&
        CoordinatesData.longitude !== null
      ) {
        setCoordinates(CoordinatesData);
      }
      setIsLoading(true);
    } catch (error) {
      setIsLoading(true);
    }
  };
  useEffect(() => {
    handleCoordinates();
  }, [address]);
  return (
    <>
      {isLoading ? (
        <MapContainer
          bounds={[
            [
              Number(coordinates?.latitude) - 0.01,
              Number(coordinates?.longitude) - 0.01,
            ],
            [
              Number(coordinates?.latitude) + 0.01,
              Number(coordinates?.longitude) + 0.01,
            ],
          ]}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            //    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={[
              Number(coordinates.latitude),
              Number(coordinates.longitude),
            ]}
          >
            <Popup>Đây là vị trí bạn chọn!</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Map;

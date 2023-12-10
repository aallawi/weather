import React, { useState } from 'react';

const LocationComponent: React.FC = () => {
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoordinates({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting location:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };



    return (
        <div>
            <button onClick={handleGetLocation}>Get Location</button>
            {coordinates && (
                <div>
                    Latitude: {coordinates.latitude}
                    <br />
                    Longitude: {coordinates.longitude}
                </div>
            )}
        </div>
    );
};

export default LocationComponent;

// MapComponent.tsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

interface MapComponentProps {
    srcLat: number | null;
    srcLng: number | null;
    destLat: number | null;
    destLng: number | null;
}

const containerStyle = {
    width: '100%',
    height: '25rem'
};

const center = {
    lat: 40.735657,
    lng: -74.172363
};

const MapComponent: React.FC<MapComponentProps> = ({ srcLat, srcLng, destLat, destLng }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    const [, setMap] = useState(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    const onLoad = React.useCallback((map: any) => setMap(map), []);

    const onUnmount = React.useCallback(() => setMap(null), []);

    const markers = [
        { lat: srcLat, lng: srcLng, label: 'Origin' },
        { lat: destLat, lng: destLng, label: 'Destination' }
    ];

    useEffect(() => {
        if (srcLat && srcLng && destLat && destLng) {
            const directionsService = new window.google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: { lat: srcLat, lng: srcLng },
                    destination: { lat: destLat, lng: destLng },
                    travelMode: window.google.maps.TravelMode.DRIVING
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        console.error(`Error fetching directions: ${status}`);
                    }
                }
            );
        }
    }, [srcLat, srcLng, destLat, destLng]);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
                zoomControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                mapTypeControl: false,
                disableDefaultUI: true,
            }}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {markers.map((marker) => (
                marker.lat && marker.lng &&
                <Marker
                    key={marker.label}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    label={marker.label}
                />
            ))}

            {directions && <DirectionsRenderer 
                                directions={directions} 
                                options={{
                                    polylineOptions: {
                                        strokeColor: '#1840b8',
                                    },
                                }}
                            />}
        </GoogleMap>
    );
};

export default MapComponent;

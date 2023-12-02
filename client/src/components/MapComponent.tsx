// MapComponent.tsx
import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '25rem'
};

const center = {
    lat: 40.735657,
    lng: -74.172363
};

const MapComponent: React.FC = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    const [map, setMap] = useState(null);

    const onLoad = React.useCallback((map: any) => setMap(map), [])

    const onUnmount = React.useCallback(() => setMap(null), []);

    if (!isLoaded) return <><div>Loading...</div></>;

    return (
        <>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
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
                <Marker position={center} />
            </GoogleMap>
        </>
    );
};

export default MapComponent;

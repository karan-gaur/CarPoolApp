import axios from 'axios';

export const getCoordinatesFromAddress1 = (place_id: string) => {
    try {
        // const apiKey = 'AIzaSyAbKNLVR_45o_znJXRpXxPGF9g3YmIsqEc';
        // console.log('apiKey', apiKey);
        // const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
        //     params: {
        //         place_id,
        //         key: apiKey,
        //     },
        // });

        // const data = response.data;
        // return data.result.geometry.location;
        console.log('place_id', place_id);
        return {
            "lat": 40.7604095,
            "lng": -73.9870026
        };
    } catch (error) {
        console.error('Error fetching place details:', error);
        throw error;
    }
};

export const getCoordinatesFromAddress2 = (place_id: string) => {
    try {
        // const apiKey = 'AIzaSyAbKNLVR_45o_znJXRpXxPGF9g3YmIsqEc';
        // console.log('apiKey', apiKey);
        // const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
        //   params: {
        //     place_id,
        //     key: apiKey,
        //   },
        // });

        // const data = response.data;
        // return data.result.geometry.location;

        return {
            "lat": 40.7440691,
            "lng": -74.17928449999999
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
        throw error;
    }
};

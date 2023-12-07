import axios from 'axios';

export const getCoordinatesFromAddress = async (place_id: string) => {
    try {
        console.log('place_id', place_id);
        const response = await axios.get(`http://localhost:3000/google/location?place_id=${place_id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return response.data.location;
    } catch (error) {
        console.error('Error fetching place details:', error);
        throw error;
    }
};


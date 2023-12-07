
import ThreejsPlane from '../components/ImagePlane';
import Transition from '../components/Transition';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import MapComponent from '../components/MapComponent';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface LongLatType {
    lat: number,
    lng: number
}

const RideDetail = () => {
    const navigate = useNavigate();
    const { user, token, isAuthenticated, dispatch } = useAuth();
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [ srcCor, setSrcCor ] = useState<LongLatType | null>(null);
    const [ destCor, setDestCor ] = useState<LongLatType | null>(null);



    const fetchDetails = async () => {
        console.log('id', id);
        const res = await axios.post('http://localhost:3000/ride/details',
            {
                "ride_id": id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        setData(res.data);
        setSrcCor({
            lat: res.data.driverDetails[0].source_latitude,
            lng: res.data.driverDetails[0].source_longitude
        });
        setDestCor({
            lat: res.data.driverDetails[0].dest_latitude,
            lng: res.data.driverDetails[0].dest_longitude
        });
    };

    useEffect(() => {
        const isToken = localStorage.getItem("token");
        console.log('isToken', isToken);
        if (!isToken) {
            console.log("Not Authenticated");
            navigate("/login");
        } else {
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: {
                    user: user,
                    token: isToken,
                },
            });

            fetchDetails();
        }
    }, [isAuthenticated, token, user, navigate, dispatch]);

    

    const tripStart = async (username: string) => {
        const res = await axios.post('http://localhost:3000/ride/start',
            {
                "ride_id": id,
                "username": username
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        if (res.status === 200) {
            fetchDetails();
        }
    }

    const tripEnd = async (username: string) => {
        const res = await axios.post('http://localhost:3000/ride/end',
            {
                "ride_id": id,
                "username": username,
                "crating": 5
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        if (res.status === 200) {
            fetchDetails();
        }
    }

    return (
        <>
            <Transition />
            <div className='min-h-screen bg-black absolute z-10 w-screen flex flex-col items-center'>
                <div className='flex flex-col w-full'>
                    <MapComponent srcLat={srcCor?.lat || 0} srcLng={srcCor?.lng || 0} destLat={destCor?.lat || 0} destLng={destCor?.lng || 0} />
                    <div className='mt-10 px-52 max-md:px-20'>
                        <div className="bg-gray-800 grid grid-cols-2 w-full p-6 rounded-lg shadow-lg text-white mb-28">
                            {data?.is_driver && (
                                <>
                                    {/* Driver Details */}
                                    <h1 className="text-3xl font-bold">Driver Details</h1>

                                    <div className='col-span-1'>
                                        <h2 className="text-xl font-bold">{`${data.driverDetails[0].first_name} ${data.driverDetails[0].last_name}`}</h2>
                                        <p>{`Rating: ${data.driverDetails[0].driver_rating}`}</p>
                                        <p>{`Phone: ${data.driverDetails[0].phone_number}`}</p>
                                    </div>

                                    {/* Car Details */}
                                    <h1 className="text-3xl font-bold mt-10">Car Details</h1>

                                    {data?.carDetails.length > 0 && (
                                        <div className="col-span-1 mt-10">
                                            <p>{`Car: ${data.carDetails[0].make} ${data.carDetails[0].model}`}</p>
                                            <p>{`Color: ${data.carDetails[0].color}`}</p>
                                            <p>{`Seats: ${data.carDetails[0].seats}`}</p>
                                        </div>
                                    )}

                                    {/* User Details */}
                                    {data?.userDetails.length > 0 && (
                                        <div className="mt-10 col-span-2">
                                            <h1 className="text-3xl font-bold text-left">Passenger Details</h1>
                                            {data.userDetails.map((user: any, index: number) => (
                                                <div key={index} className="border-t border-gray-700 pt-4 mt-4 text-left grid grid-cols-2">
                                                    <p className='col-span-1'>{`Username: ${user.username}`}</p>

                                                    <p>{`Source: ${user.source_id}`}</p>
                                                    <p>{`Destination: ${user.dest_id}`}</p>
                                                    <p>{`Rating: ${user.customer_rating}`}</p>

                                                    {
                                                        data.is_driver ? (
                                                            // If user is a driver
                                                            <>
                                                                {user.start_time === null ? (
                                                                    // If trip has not started
                                                                    <button
                                                                        className="col-span-1 top-0 right-0 mr-4 mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                                                        onClick={async () => {
                                                                            await tripStart(user.username);
                                                                            console.log('Trip Started');
                                                                        }}
                                                                    >
                                                                        Start Trip
                                                                    </button>
                                                                ) : user.end_time === null ? (
                                                                    // If trip is in progress
                                                                    <button
                                                                        className="top-0 right-0 mr-4 mt-4 bg-red-500 text-white px-4 py-2 rounded"
                                                                        onClick={async () => {
                                                                            await tripEnd(user.username);
                                                                            console.log('Trip Ended');
                                                                        }}
                                                                    >
                                                                        End Trip
                                                                    </button>
                                                                ) : (
                                                                    // If trip is completed
                                                                    <div className="flex items-center mt-4">
                                                                        <p className='text-4xl text-green-600'>Trip completed!</p>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            // If user is not a driver
                                                            <div className="flex items-center mt-4">
                                                                {user.start_time === null ? (
                                                                    // If trip has not started
                                                                    <p className='text-4xl text-yellow-400'>Rider is waiting for the Driver</p>
                                                                ) : (
                                                                    // If trip is in progress
                                                                    <p className='text-4xl text-green-600'>Trip is in progress</p>
                                                                )}
                                                            </div>
                                                        )
                                                    }

                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default RideDetail;

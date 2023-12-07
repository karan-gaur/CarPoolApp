
import ThreejsPlane from '../components/ImagePlane';
import Transition from '../components/Transition';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import MapComponent from '../components/MapComponent';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const RideDetail = () => {
    const navigate = useNavigate();
    const { user, token, isAuthenticated, dispatch } = useAuth();
    const mapRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        gsap.from(mapRef.current, {
            duration: 1,
            opacity: 0,
            x: '-100%',
            ease: 'power4.out',
            delay: 1
        });

        gsap.from(contentRef.current, {
            duration: 1,
            opacity: 0,
            x: '100%',
            ease: 'power4.out',
            delay: 1
        });
    }, []);

    useEffect(() => {
        const isToken = localStorage.getItem("token");
        console.log('isToken', isToken);
        if(!isToken) {
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
    
         
    
        }
    }, [isAuthenticated, token, user, navigate, dispatch]);

    const srcCor = {
        lat: 40.735657,
        lng: -74.172363
    };

    const destCor = {
        "lat": 40.7440691,
        "lng": -74.17928449999999
    }


    return (
        <>
            <Transition />
            <div className='min-h-screen bg-black absolute z-10 w-screen flex flex-col items-center'>
                <ThreejsPlane />
                <div className='w-full flex justify-center relative bg-transparent profile-header mt-32 text-6xl'>
                    Ride Detail
                </div>

                <div className='w-4/5 flex'>
                    <div ref={mapRef} className='flex flex-col w-1/2 rounded-lg'>
                        <MapComponent
                            srcLat={srcCor.lat}
                            srcLng={srcCor.lng}
                            destLat={destCor.lat}
                            destLng={destCor.lng}
                        />
                    </div>

                    <div ref={contentRef} className='flex flex-col lg:flex-row w-full lg:w-1/2 ml-10 text-left z-10 bg-gray-800 p-6 rounded-lg'>
                        <div className="lg:w-1/2 pr-6">
                            <h1 className="text-2xl font-bold mb-2 text-white">From:</h1>
                            <span className="text-gray-300">271 Van Wagenen Ave, Jersey City, New Jersey</span>

                            <div className="my-4">
                                <h1 className="text-2xl font-bold mb-2 text-white">Driver:</h1>
                                <span className="text-gray-300">John Doe</span>
                            </div>

                            <div className="mb-4">
                                <h1 className="text-2xl font-bold mb-2 text-white">Driver Rating:</h1>
                                <span className="text-yellow-500">4.5</span>
                            </div>


                        </div>

                        <div className="lg:w-1/2 pl-6">
                            <h1 className="text-2xl font-bold mb-2 text-white">To:</h1>
                            <span className="text-gray-300">NJIT Campus Center, Newark, New Jersey</span>

                            <div className="my-4">
                                <h1 className="text-2xl font-bold mb-2 text-white">Passengers:</h1>
                                <ul className="list-disc ml-4">
                                    <li className="text-gray-300">John Doe</li>
                                    <li className="text-gray-300">Het Patel</li>
                                    <li className="text-gray-300">Karan Gaur</li>
                                    <li className="text-gray-300">Ashish Reddy</li>
                                </ul>
                            </div>

                            <div className="mb-4">
                                <h1 className="text-2xl font-bold mb-2 text-white">Passenger Rating:</h1>
                                <span className="text-yellow-500">4.5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RideDetail;

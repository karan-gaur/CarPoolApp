import Transition from '../components/Transition';
import Buttton from '../components/Button';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { useCallback, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import MapComponent from '../components/MapComponent';
import { getCoordinatesFromAddress } from '../services/googleApiService';
import './RideSearch.css';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface FormDataType {
  date: string,
}

const containerStyle = {
  width: '100%',
  height: '25rem'
};

const center = {
  lat: 40.735657,
  lng: -74.172363
};

interface CorsType {
  lat: number | null;
  lng: number | null;
}

const RidePublish = () => {
  const navigate = useNavigate();
    const { user, token, isAuthenticated, dispatch } = useAuth();
  const {
    ready: readyFrom,
    value: valueFrom,
    setValue: setValueFrom,
    suggestions: suggestionsFrom,
    clearSuggestions: clearSuggestionsFrom
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
  });

  const {
    ready: readyTo,
    value: valueTo,
    setValue: setValueTo,
    suggestions: suggestionsTo,
    clearSuggestions: clearSuggestionsTo
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
  });

  const [formData, setFormData] = useState<FormDataType>({
    date: '',
  });

  const [srcCor, setSrcCor] = useState<CorsType>({ lat: null, lng: null });
  const [destCor, setDestCor] = useState<CorsType>({ lat: null, lng: null });
  const [carList, setCarList] = useState<any[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>(carList.length > 0 ? carList[0] : '');
  const [src, setSrc] = useState<string>('');
  const [dest, setDest] = useState<string>('');

  const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

  const getCars = async () => {
    const res = await axios.get(`${BASE_URL}/cars`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const cars = res.data.cars.map((car: any) => {
      return `${car.make}_${car.model}_${car.number}_${car.seats}`;
    });
    setCarList(cars);
    setSelectedCar(cars.length > 0 ? cars[0] : '');
  };

  useEffect(() => {
    getCars();
  }, []);

  const renderSuggestionsFrom = () =>
    suggestionsFrom.data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li className='cursor-pointer text-left' key={place_id} onClick={handleSelectFrom(place_id, main_text)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  const renderSuggestionsTo = () =>
    suggestionsTo.data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li className='cursor-pointer text-left' key={place_id} onClick={handleSelectTo(place_id, main_text)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  const onRidePublish = async () => {
    try {
      console.log('Selected car:', selectedCar);
      const carNumber = selectedCar.split('_')[2];
      const seats = selectedCar.split('_')[3];
      
      const response = await axios.post(`${BASE_URL}/ride/publish`, {
        "car_number": carNumber,
        "departure_time": new Date().getTime(),
        "seats_available": seats,
        "source_addr": src,                    // Source addr - NJIT
        "dest_addr": dest
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );


      if(response.status === 200) {
        toast.success('Ride published successfully');
        setFormData({
          date: '',
        });
        setValueFrom('');
        setValueTo('');
        setSelectedCar(carList.length > 0 ? carList[0] : '');
      } else {
        toast.error('Error publishing ride');
      }

    } catch (error) {
      console.error('Error publishing ride:', error);
      toast.error('Error publishing ride');
    }

  };

  const handleSelectFrom = (place_id: string, main_text: string) => async () => {
    try {
      setValueFrom(main_text, false);
      clearSuggestionsFrom();
      const { lat, lng } = await getCoordinatesFromAddress(place_id);
      setSrcCor({ lat, lng });
      setSrc(place_id);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleSelectTo = (place_id: string, main_text: string) => async () => {
    try {
      setValueTo(main_text, false);
      clearSuggestionsTo();
      const { lat, lng } = await getCoordinatesFromAddress(place_id);
      setDestCor({ lat, lng });
      setDest(place_id);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

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

  return (
    <>
      <Transition />
      <ToastContainer />
      <div className='bg-black min-h-screen absolute z-10 w-screen flex flex-col items-center'>
        <div className='flex flex-col w-full'>
          <MapComponent srcLat={srcCor.lat} srcLng={srcCor.lng} destLat={destCor.lat} destLng={destCor.lng} />
          <form className='mt-10 px-52 max-md:px-20'>
            <div className="grid gap-6 mb-6 grid-cols-2 max-md:grid-cols-1">
              <div className="col-span-1">
                <label htmlFor="source" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">From?</label>
                <input
                  type="text"
                  value={valueFrom}
                  onChange={e => setValueFrom(e.target.value)}
                  id="source"
                  className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="271 Van Wagenene Ave, Jersey City"
                  required
                />
                {suggestionsFrom.status === 'OK' && <ul>{renderSuggestionsFrom()}</ul>}
              </div>
              <div className="col-span-1">
                <label htmlFor="destination" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Where To?</label>
                <input
                  type="text"
                  value={valueTo}
                  onChange={e => setValueTo(e.target.value)}
                  id="destination"
                  className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="NJIT Campus Center"
                  required
                />
                {suggestionsTo.status === 'OK' && <ul>{renderSuggestionsTo()}</ul>}
              </div>
            </div>

            <div className="grid gap-6 mb-6 grid-cols-2 max-md:grid-cols-1">
              <div className="col-span-1">
                <label htmlFor="car" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Car</label>
                <select
                  id="car"
                  value={selectedCar}
                  onChange={(e) => setSelectedCar(e.target.value)}
                  className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  {carList.map((car, index) => (
                    <option key={index} value={car}>
                      {car}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                <input
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  type="text"
                  id="date"
                  className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="mm-dd-yyyy HH:MM"
                  required
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 grid-cols-3 max-md:grid-cols-1">
              <div className="col-span-1 mt-2">
              </div>
              <div className="col-span-1 mt-2">
                <Buttton width='w-full' height='h-5' onClick={onRidePublish} text={'Publish'} />
              </div>
            </div>
          </form>

        </div>
      </div>
    </>
  )
}

export default RidePublish;

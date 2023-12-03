import Transition from '../components/Transition';
import Buttton from '../components/Button';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { useEffect, useRef, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { getCoordinatesFromAddress1, getCoordinatesFromAddress2 } from '../services/googleApiService';
import './RideSearch.css';

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

const RideSearch = () => {

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

  const [formData, setFormData] = useState({
    seats: '',
    date: '',
  });

  const [srcCor, setSrcCor] = useState<CorsType>({ lat: null, lng: null });
  const [destCor, setDestCor] = useState<CorsType>({ lat: null, lng: null });


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

  const onRideSearch = () => {
    console.log('Form Submitted!');
    console.log(formData);
    console.log(srcCor);
    console.log(destCor);
  };

  const handleSelectFrom = (place_id: string, main_text: string) => async () => {
    try {
      setValueFrom(main_text, false);
      clearSuggestionsFrom();
      const { lat, lng } = getCoordinatesFromAddress1(place_id);
      setSrcCor({ lat, lng });
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleSelectTo = (place_id: string, main_text: string) => async () => {
    try {
      setValueTo(main_text, false);
      clearSuggestionsTo();
      const { lat, lng } = getCoordinatesFromAddress2(place_id);
      setDestCor({ lat, lng });
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const profileRef = useRef(null);
  const profileImageRef = useRef(null);

  useEffect(() => {
    const profileElement = profileRef.current;
    const profileImageElement = profileImageRef.current;

    if (profileElement) {
      const profile = gsap.timeline();
      profile.from(profileElement, {
        duration: 1,
        y: '100%',
        opacity: 0,
        ease: Power4.easeOut,
        delay: 1,
      });
    }

    if (profileImageElement) {
      const profile = gsap.timeline();
      profile.from(profileImageElement, {
        duration: 1,
        y: '-100%',
        opacity: 0,
        ease: Power4.easeOut,
        delay: 1,
      });
    }
  }, []);

  return (
    <>
      <Transition />
      <div className='min-h-screen bg-black absolute z-10 w-screen flex flex-col items-center'>
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
                  className="input-container border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
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
                  className="input-container border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                  placeholder="NJIT Campus Center" 
                  required 
                />
                {suggestionsTo.status === 'OK' && <ul>{renderSuggestionsTo()}</ul>}
              </div>
            </div>

            <div className="grid gap-6 mb-6 grid-cols-3 max-md:grid-cols-1">
              <div className="col-span-1">
                <label htmlFor="seats" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No of Seats Required</label>
                <input 
                  value={formData.seats}
                  onChange={(e) => (
                    setFormData((prev) => ({ ...prev, seats: e.target.value }))
                  )}
                  type="text" 
                  id="seats" 
                  className="input-container border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                  placeholder="No of Seats" 
                  required 
                />
              </div>
              <div className="col-span-1 mt-2 max-md:hidden">
                <Buttton width='w-full' height='h-5' onClick={onRideSearch} text={'Submit'} />
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
                  className="input-container border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="mm-dd-yyyy"
                  required
                />
              </div>
              <div className="col-span-1 mt-2 md:hidden">
                <Buttton width='w-full' height='h-5' onClick={onRideSearch} text={'Search'} />
              </div>
            </div>
          </form>

        </div>
      </div>
    </>
  )
}

export default RideSearch;

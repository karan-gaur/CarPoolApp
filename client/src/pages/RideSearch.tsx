import Transition from '../components/Transition';
import Buttton from '../components/Button';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useCallback, useState } from 'react';
import MapComponent from '../components/MapComponent';

const containerStyle = {
  width: '100%',
  height: '25rem'
};

const center = {
  lat: 40.735657,
  lng: -74.172363
};


const RideSearch = () => {

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete({
    callbackName: "YOUR_CALLBACK_NAME",
    requestOptions: {},
    debounce: 300,
  });

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={() => console.log("Item clicked")}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });


  return (
    <>
      <Transition />
      <div className='min-h-screen absolute z-10 w-screen flex flex-col items-center'>
        <div className='flex flex-col w-full'>
          <MapComponent />
          <form className='mt-10 px-52 max-md:px-20'>
            <div className="grid gap-6 mb-6 grid-cols-2 max-md:grid-cols-1">
              <div className="col-span-1">
                <label htmlFor="source" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">From?</label>
                <input type="text" value={value} onChange={e => setValue(e.target.value)} id="source" className="bg-slate-200 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="271 Van Wagenene Ave, Jersey City" required />
                {status === "OK" && <ul>{renderSuggestions()}</ul>}
              </div>
              <div className="col-span-1">
                <label htmlFor="destination" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Where To?</label>
                <input type="text" id="destination" className="bg-slate-200 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="NJIT Campus Center" required />
              </div>
            </div>

            <div className="grid gap-6 mb-6 grid-cols-3 max-md:grid-cols-1">
              <div className="col-span-1">
                <label htmlFor="seats" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No of Seats Required</label>
                <input type="text" id="seats" className="bg-slate-200 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="No of Seats" required />
              </div>
              <div className="col-span-1 mt-2 max-md:hidden">
                <Buttton width='w-full' height='h-5' onClick={() => console.log('Form Submitted!')} text={'Submit'} />
              </div>
              <div className="col-span-1">
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date and Time</label>
                <input type="text" id="date" className="bg-slate-200 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="123-45-678" required />
              </div>
              <div className="col-span-1 mt-2 md:hidden">
                <Buttton width='w-full' height='h-5' onClick={() => console.log('Form Submitted!')} text={'Submit'} />
              </div>
            </div>
          </form>

        </div>
      </div>
    </>
  )
}

export default RideSearch
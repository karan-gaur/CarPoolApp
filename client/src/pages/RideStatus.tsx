import React from 'react'
import Transition from '../components/Transition';
import { Link } from 'react-router-dom';
import './RideStatus.css';

const RideStatus = () => {
  return (
    <>
      <Transition />
      <div className='ongoing-container'>
        <h1>No ongoing rides.</h1>
        <h3><Link to={"/ride-search"}>Click here</Link> to search for a new ride.</h3>
      </div>
    </>
  )
}

export default RideStatus

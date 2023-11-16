import React from 'react'
import Transition from '../components/Transition';

const Profile = () => {
  return (
    <>
      <Transition />
      <div className='min-h-screen min-w-full flex items-center'>
        <div className='min-w-full flex flex-row max-sm:flex-col justify-center space-x-3'>
          <div className='w-56 h-36 bg-red-500'>

          </div>
          <div className='flex flex-col justify-start'>
            <h1>Username:</h1>
            <h5>phet2309</h5>
            
            <h1>First Name:</h1>
            <h5>Het</h5>

            <h1>Last Name:</h1>
            <h5>Patel</h5>

            <h1>Mobile Number:</h1>
            <h5>9737676688</h5>

            <h1>Email:</h1>
            <h5>phet2309@gmail.com</h5>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
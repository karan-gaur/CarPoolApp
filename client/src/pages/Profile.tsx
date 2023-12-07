import './Profile.css';
import profileImage from '../assets/profileImage.jpg';
import Transition from '../components/Transition';
import ThreejsPlane from '../components/ImagePlane';
import Button from '../components/Button';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, Power4 } from 'gsap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ProfileResponse {
    first_name: string;
    last_name: string;
    username: string;
    phone_number: string;
    driver_rating: number;
    user_rating: number;
}


const Profile = () => {

  const navigate = useNavigate();
  const profileRef = useRef(null);
  const profileImageRef = useRef(null);

  const { user, token, isAuthenticated, dispatch } = useAuth();

  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');

  const fetchData = useMemo(
    () => async () => {
      try {
        const response = await axios.get('http://localhost:3000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Profile data:', response.data);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    },
    [token]
  );

  const fetchUserAddressData = useMemo(
    () => async () => {
      try {
        const response = await axios.get('http://localhost:3000/address', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Profile data:', response.data);
        const addressObj = response.data.address[0];
        const address = `${addressObj.apt_number} ${addressObj.street_name}, ${addressObj.city_name}, ${addressObj.state}, ${addressObj.zip_code}`;
        setUserAddress(address);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    },
    [token]
  );
  

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

      fetchData();
      fetchUserAddressData();
      
    }
  }, [isAuthenticated, token, user, navigate, dispatch]);

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
  }, [profileRef, profileImageRef]);

  const handleEditProfileClick = () => {
    navigate('/edit-profile');
  };



  return (
    <>
      <Transition />
      <div className='min-h-screen w-full flex flex-col items-center'>
        <ThreejsPlane />
        <div ref={profileImageRef} className='w-full flex justify-center relative bg-transparent profile-header'>
          <img className='w-44 h-44 rounded-full absolute -bottom-20' src={profileImage}></img>
        </div>
        <div ref={profileRef} className='pt-24 z-10'>
          <div>{`@${profileData?.first_name[0]?.toLocaleLowerCase()}${profileData?.last_name[0]?.toLocaleLowerCase()}${profileData?.phone_number?.slice(0,3)}`}</div>
          <div className='text-4xl font-bold'>{`${profileData?.first_name} ${profileData?.last_name}`}</div>
          <div className='text-lg mt-5'>{`${profileData?.phone_number} | ${profileData?.username}`}</div>
          <div className='text-lg mt-2'></div>
          <div>{`Address: ${userAddress}`}</div>
          <div className='flex justify-between mt-5'>
            <div className='flex flex-col items-center'>
              <div className='text-2xl font-bold'>5</div>
              <div>Published Rides</div>
            </div>
            <div className='flex flex-col items-center'>
              <div className='text-2xl font-bold'>7</div>
              <div>Booked Rides</div>
            </div>
          </div>
          <div className='flex justify-between mt-5'>
            <div className='flex flex-col items-center'>
              <div className='text-2xl font-bold'>{profileData?.driver_rating}</div>
              <div>Driver Rating</div>
            </div>
            <div className='flex flex-col items-center'>
              <div className='text-2xl font-bold'>{profileData?.user_rating}</div>
              <div>Rider Rating</div>
            </div>
          </div>
          <Button width='w-full' height='h-5' text='My Rides' onClick={() => console.log("Button Clicked")} />
          <Button width='w-full' height='h-5' text='Edit Profile' onClick={handleEditProfileClick} />
        </div>
      </div>

    </>
  )
}

export default Profile
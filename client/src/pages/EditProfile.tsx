import React, { useContext } from 'react';
import EditProfileForm from '../components/EditProfileForm';
import { useAuth } from '../hooks/useAuth';
import Transition from '../components/Transition';
import ThreejsPlane from '../components/ImagePlane';

const EditProfile = () => {
  const { token } = useAuth();

  return (
    <>
      <Transition />
      <ThreejsPlane />
      <EditProfileForm  />
    </>
  );
};

export default EditProfile;
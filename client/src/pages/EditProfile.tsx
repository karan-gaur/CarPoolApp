import React, { useContext } from 'react';
import EditProfileForm from '../components/EditProfileForm';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';

const EditProfile = () => {
  const { token } = useAuth();

  return (
    <div>
      <h2>This is Edit Profile</h2>
      <EditProfileForm token={token} handleSaveClick={(updatedDetails) => console.log(updatedDetails)} />
    </div>
  );
};

export default EditProfile;
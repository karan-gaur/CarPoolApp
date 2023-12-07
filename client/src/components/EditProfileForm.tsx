// EditProfileForm.tsx
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface EditProfileFormProps {
  handleSaveClick: (updatedDetails: any) => void;
  token:string;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ handleSaveClick }) => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<any>({
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          console.log('Not Authenticated');
          navigate('/login');
          return;
        }

        console.log('Authenticated');

        // Fetch user profile data directly using the token
        const profileResponse = await axios.get('http://localhost:3000/profile', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        // Fetch user address data
        const addressResponse = await axios.get('http://localhost:3000/address', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const userProfileData = profileResponse.data;
        const userAddressData = addressResponse.data[0];

        setUserDetails({
          first_name: userProfileData.first_name,
          last_name: userProfileData.last_name,
          phone_number: userProfileData.phone_number,
          address: userAddressData.address || '',
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving user details:', userDetails);
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        console.log('Not Authenticated');
        return;
      }

      // Update user profile
      const profileUpdateResponse = await axios.post('http://localhost:3000/profile', userDetails, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      console.log('Profile Updated:', profileUpdateResponse.data);

      // Update user address
      const addressUpdateResponse = await axios.post('your-update-address-api-endpoint', {
        address: userDetails.address,
      }, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      console.log('Address Updated:', addressUpdateResponse.data);

      handleSaveClick(userDetails);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <>
          <div>
      {isEditing ? (
        <form>
          <label>
            First Name:
            <input
              type="text"
              name="first_name"
              value={userDetails.first_name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={userDetails.last_name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              name="phone_number"
              value={userDetails.phone_number}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={userDetails.address}
              onChange={handleInputChange}
            />
          </label>
          <button type="button" onClick={handleSave}>
            Save
          </button>
        </form>
      ) : (
        <div>
          <p>First Name: {userDetails.first_name}</p>
          <p>Last Name: {userDetails.last_name}</p>
          <p>Phone Number: {userDetails.phone_number}</p>
          <p>Address: {userDetails.address}</p>
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default EditProfileForm;

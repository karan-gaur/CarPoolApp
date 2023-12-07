// EditProfileForm.tsx
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/RideSearch.css';
import Buttton from '../components/Button'



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
        
        <>
        <div className="flex items-center justify-center h-screen w-screen">
       <div className="bg-gray-800 p-8 rounded-lg"> 
             
             <form>
             <div className="col-span-1">
   <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
     First Name
   </label>
   <input
     type="text"
     id="first_name"
     name="first_name"
     value={userDetails.first_name}
     onChange={handleInputChange}
     className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
     required
   />
 </div>
               <div className="col-span-1">
   <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
     Last Name
   </label>
   <input
     type="text"
     id="last_name"
     name="last_name"
     value={userDetails.last_name_name}
     onChange={handleInputChange}
     className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
     required
   />
 </div>
               
               <div className="col-span-1">
                  <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                   <input 
                      type="text" 
                      id="phone_number" 
                      name="phone_number"
                      value={userDetails.phone_number}
                      onChange={handleInputChange}
                      className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                      required 
                    />
               </div>
               <div className="col-span-1">
   <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
     Address
   </label>
   <input
     type="text"
     id="address"
     name="address"
     value={userDetails.address}
     onChange={handleInputChange}
     className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
     required
   />
 </div>
               <div className="col-span-1 mt-2 ">
                 <Buttton width='w-full' height='h-5' text={'Save Details'} onClick={handleSave}  />
               </div>
             </form>
         </div>
     </div>
           
         </>
        
      ) : (
        <div className="flex items-center justify-center h-screen w-screen">
      <div className="bg-gray-800 p-8 rounded-lg">
        <div>
          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name: {userDetails.first_name}</p>
          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name: {userDetails.last_name}</p>
          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number: {userDetails.phone_number}</p>
          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address: {userDetails.address}</p>
          <Buttton
            width='w-full' height='h-5'  text={'Edit Details'}
            onClick={() => setIsEditing(true)}
            
          />
            
          
        </div>
      </div>
    </div>
  
      )}
    </div>
    </>
  );
};

export default EditProfileForm;

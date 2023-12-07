
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import ThreejsPlane from '../components/ImagePlane';
import Transition from '../components/Transition';
import Button from '../components/Button';
import gsap from 'gsap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface CarAddState {
    number: string,
    seats: number,
    make: string,
    model: string,
    color: string
}

const CarAdd: React.FC = () => {

    const formRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const form = formRef.current;

        gsap.from(form, {
            duration: 1,
            opacity: 0,
            y: '100%',
            ease: 'power4.out',
            delay: 1
        });

    }, []);

    const [formData, setFormData] = useState<CarAddState>({
        seats: 0,
        number: '',
        make: '',
        model: '',
        color: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:3000/cars', formData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
        );
        
        if (response.status === 200) {
            toast.success('Car added successfully!');
            setFormData({
                seats: 0,
                number: '',
                make: '',
                model: '',
                color: ''
            });
        } else {
            toast.error(response.data.message || 'Error adding car!');
        }
    };

    return (
        <>
            <ToastContainer />
            <Transition />
            <div className='min-h-screen bg-black absolute z-10 w-screen flex flex-col items-center'>
                <ThreejsPlane />
                <div className='w-full flex justify-center relative bg-transparent profile-header mt-32 text-6xl'>
                    Add Car
                </div>
                <div className='flex flex-col z-10 w-3/5'>
                    <h2 className="text-2xl font-semibold mb-4">Car Information</h2>
                    <div ref={formRef} className="w-full mx-auto mt-8 p-6 rounded shadow-md">
                        <form className='grid grid-cols-3'>
                            <div className="mb-4 col-span-1 mx-5">
                                <label htmlFor='seats' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seats</label>
                                <input
                                    type="number"
                                    name='seats'
                                    value={formData.seats}
                                    onChange={handleChange}
                                    id="seats"
                                    className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="4"
                                    required
                                />
                            </div>
                            <div className="mb-4 col-span-1 mx-5">
                                <label htmlFor='plate' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Plate Number</label>
                                <input
                                    type="text"
                                    name='number'
                                    value={formData.number}
                                    onChange={handleChange}
                                    id="plate"
                                    className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="ABC123"
                                    required
                                />
                            </div>
                            <div className="mb-4 col-span-1 mx-5">
                                <label htmlFor='make' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Make</label>
                                <input
                                    type="text"
                                    name='make'
                                    value={formData.make}
                                    onChange={handleChange}
                                    id="make"
                                    className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Toyota"
                                    required
                                />
                            </div>
                            <div className="mb-4 col-span-1 mx-5">
                                <label htmlFor='model' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model</label>
                                <input
                                    type="text"
                                    name='model'
                                    value={formData.model}
                                    onChange={handleChange}
                                    id="model"
                                    className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Camry"
                                    required
                                />
                            </div>

                            <div className="mb-4 col-span-1 mx-5 mt-2">
                                <Button width='w-full' height='h-5' text='Add Car' onClick={handleSubmit} />
                            </div>

                            <div className="mb-4 col-span-1 mx-5">
                                <label htmlFor='color' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Color</label>
                                <input
                                    type="text"
                                    name='color'
                                    value={formData.color}
                                    onChange={handleChange}
                                    id="color"
                                    className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Black"
                                    required
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CarAdd;

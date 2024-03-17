import { useEffect, useRef } from 'react'
import gsap from 'gsap';
import imageAnimation from '../assets/CarDrivingAnimation.json';
import Lottie from "lottie-react";


const CarDrivingAnimation = () => {
    const carRef = useRef(null);

    useEffect(() => {
        const car = carRef.current;

        gsap.to(car, {
            x: '100%', // Move to the right
            duration: 4, // Adjust the duration as needed
            ease: 'linear',
            repeat: -1, // Repeat the animation indefinitely
        });

        return () => {
            gsap.killTweensOf(car); // Kill the animation on component unmount
        };
    }, []);


    return (
        <div ref={carRef} style={{ width: '100vw', height: '200px', overflow: 'hidden' }}>
            <div className=' h-44'
                style={{ width: '100%', display: 'flex' }}
                ref={carRef}
            >
                <Lottie animationData={imageAnimation} loop={true} />            
            </div>
        </div>
    )
}

export default CarDrivingAnimation
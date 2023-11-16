import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImage from '../assets/hero.jpg';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero-text',
                // markers: true,
                start: '100px 50%',
                end: '100px 40%',
                scrub: 2,
            },
        });

        // Add animations to the timeline
        tl.to('.hero-text', {
            y: -200,
            fontSize: '2rem',
        });

        gsap.to('.hero-image', {
            scale: 1.5, // Ending scale
            scrollTrigger: {
                trigger: '.hero-image',
                start: 'top 40%',
                end: 'bottom 60%',
                scrub: 2,
                markers: true,
            },
        });

    }, []);

    return (
        <>
            <div className='h-screen mx-20 mt-20 flex flex-col justify-center items-center relative overflow-hidden max-sm:mx-0'>
                <div className='absolute inset-0'>
                    <img src={heroImage} className='w-full h-full object-cover hero-image opacity-60' alt='Hero Background' />
                </div>
                <div className='text-white font-extrabold text-6xl hero-text z-10'>CommuteConnect</div>
                <div className='text-white font-bold text-xl z-10'>Navigate Commutes, Create Connections: Carpooling Simplified</div>
            </div>

        </>
    )
}

export default Hero
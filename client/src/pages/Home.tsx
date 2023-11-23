import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImage from '../assets/hero.jpg';
import Transition from '../components/Transition';
import HomeContent from '../components/HomeContent';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {

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

        tl.to('.hero-text', {
            y: -200,
            fontSize: '2rem',
        });

        gsap.to('.hero-image', {
            scale: 1.5,
            scrollTrigger: {
                trigger: '.hero-image',
                start: 'top 40%',
                end: 'bottom 60%',
                scrub: 2,
                // markers: true,
            },
        });

    }, []);

    return (
        <>
            <Transition />
            <div className='h-screen w-screen  flex flex-col justify-center items-center relative overflow-hidden'>
                <div className='w-[90%] flex justify-center mx-16 mt-20 absolute inset-0 overflow-hidden max-sm:m-0 max-sm:w-screen '>
                    <img src={heroImage} className='w-full h-full object-cover hero-image opacity-60' alt='Hero Background' />
                </div>
                <div className='text-white font-extrabold text-6xl hero-text z-10'>CommuteConnect</div>
                <div className='text-white font-bold text-xl z-10'>Navigate Commutes, Create Connections: Carpooling Simplified</div>
            </div>
            <HomeContent />
        </>
    )
}

export default Home
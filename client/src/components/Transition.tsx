import { useRef, useEffect } from 'react';
import gsap, { Power4 } from 'gsap';
import CarDrivingAnimation from './CarDrivingAnimation';

const Transition = () => {

    const transitionRef = useRef(null);

    useEffect(() => {
        const currentRef = transitionRef.current;

        if (currentRef) {
            const timeline = gsap.timeline({
                onComplete: () => {
                    // Hide the overflowing content after the animation is complete
                    (currentRef as HTMLElement).style.display = 'none';
                }
            });

            timeline.to(currentRef, {
                duration: 1.2,
                x: '100%',
                ease: Power4.easeIn,
            });
        }
    }, []);

    return (
        <div>
            <div ref={transitionRef} className="absolute flex items-center z-20 bg-black top-0 w-full h-screen">
                <CarDrivingAnimation />
            </div>
        </div>

    )
}

export default Transition
import { useRef, useEffect } from 'react';
import gsap, {Power4} from 'gsap';

const Transition = () => {

    const transitionRef = useRef(null);

    useEffect(() => {
        const timeline = gsap.timeline();
        timeline.to(transitionRef.current, {
            duration: 4,
            x: '100%',
            ease: Power4.easeOut,
        });
    }, []);

    return (
        <div>
            <div ref={transitionRef } className="absolute z-20 bg-teal-300 top-0 w-full h-screen"></div>
        </div>

    )
}

export default Transition
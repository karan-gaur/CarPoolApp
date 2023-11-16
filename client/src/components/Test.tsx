import React from 'react'
import myVideo from '../assets/hero2.mp4'
import CarpoolAnimation from './CarpoolAnimation'

const Test = () => {
    return (
        <div className='h-screen flex flex-col justify-center items-center max-md:flex-col'>
            <CarpoolAnimation />
            <div className='max-w-[60%] ml-2 text-left'>
                <h2>Discover a Greener Way to Commute</h2>
                <p>Embark on a journey with [Your Carpool Website Name], where our vision is to create a sustainable and connected campus community. By seamlessly connecting college students through shared rides, we're not just reducing carbon footprints; we're crafting a vibrant, eco-conscious college experience.</p>
                <h2>Values That Drive Us</h2>
                <ul>
                    <li>Community-Centric Connection</li>
                    <li>Sustainability at the Core</li>
                </ul>
                <h2>Empowering Your College Journey</h2>
                <li>Accessible and Reliable Rides</li>
                <li>Innovation for Tomorrow: Explore the forefront of transportation technology with us. [Your Carpool Website Name] is not just a ride-sharing platform; it's a hub of innovation, empowering you to shape the future of college commuting.</li>
            </div>
        </div>
    )
}

export default Test
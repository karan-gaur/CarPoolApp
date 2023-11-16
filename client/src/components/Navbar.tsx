import React from 'react'
import './Navbar.css';

interface NavItem {
    name: string,
    path: string,
    current: boolean
}

const navItems: Array<NavItem> = [
    { name: 'Home', path: '/', current: true },
    { name: 'Search Ride', path: '/searchride', current: false },
    { name: 'Publish Ride', path: '/publishride', current: false },
    { name: 'Contact us', path: '/contact', current: false },
]

const profileMenuItems: Array<NavItem> = [
    { name: 'Profile', path: '/profile', current: false },
    { name: 'Login', path: '/login', current: false },
    { name: 'Logout', path: '/logout', current: false },
]

const Navbar = () => {
    const [profileMenu, setProfileMenu] = React.useState(false);
    const [navMenu, setNavMenu] = React.useState(false);

    const toggleProfileMenu = () => {
        setProfileMenu(!profileMenu);
    };

    const toggleNavMenu = () => {
        setNavMenu(!navMenu);
    }

    return (
        <div className='w-full fixed flex flex-col z-10'>
            <div className='flex justify-between items-center px-5 pt-2'>
                <img
                    className="h-12 max-sm:pl-3"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                />
                <div className="flex items-center mt-2 space-x-3">
                    <img src="" alt="Profile Picture" className="relative w-8 h-8 rounded-full cursor-pointer" onClick={toggleProfileMenu} />
                    {
                        profileMenu &&
                        <div className="absolute bg-yellow-500 text-left top-14 right-10 z-20 text-black rounded-md px-3 py-2 text-sm font-medium space-y-4" style={{ minWidth: '150px' }}>
                            <ul >
                                {
                                    profileMenuItems.map((item) => (
                                        <li
                                            key={item.name}
                                            className='text-black rounded-md px-3 py-2 text-sm font-medium'
                                        >
                                            <a href={item.path}>{item.name}</a>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    }
                    <div className={`hamburger-icon ${navMenu ? 'active' : ''}`} onClick={toggleNavMenu}>
                        <div className='h-1 w-9 bg-gray-950 border bar'></div>
                        <div className='h-1 w-9 mt-1 bg-gray-950 border bar'></div>
                        <div className='h-1 w-9 mt-1 bg-gray-950 border bar'></div>
                    </div>
                </div>
            </div>
            <div className={`flex justify-between flex-col items-start nav-menu ${navMenu ? 'active' : ''}`}>
                <div className='absolute z-10 bg-blue-500 min-w-full flex flex-col items-start'>
                    {
                        navMenu &&
                        navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.path}
                                className='text-black rounded-md ml-4 px-3 py-2 text-sm font-medium'
                            >
                                {item.name}
                            </a>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar
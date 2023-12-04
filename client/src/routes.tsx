import Home from './pages/Home';
import Profile from './pages/Profile';
import RidePublish from './pages/RidePublish';
import RideSearch from './pages/RideSearch';
import RideStatus from './pages/RideStatus';
import Rides from './pages/Rides';

export const publicRoutes = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: <div>Login</div>
    },
    {
        path: '/signup',
        element: <div>Signup</div>
    },
    {
        path: '/profile',
        element: <Profile />
    },
    {
        path: '/ride-publish',
        element: <RidePublish />
    },
    {
        path: '/ride-search',
        element: <RideSearch />
    },
    {
        path: '/ride-status',
        element: <RideStatus />
    },
    {
        path: '/rides',
        element: <Rides />
    }
];

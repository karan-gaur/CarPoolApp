import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import RidePublish from './pages/RidePublish';
import RideSearch from './pages/RideSearch';
import RideStatus from './pages/RideStatus';
import Rides from './pages/Rides';
import SignUp from './pages/SignUp';

export const publicRoutes = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/signup',
        element: <SignUp />
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

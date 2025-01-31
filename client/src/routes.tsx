import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import RidePublish from './pages/RidePublish';
import RideSearch from './pages/RideSearch';
import Rides from './pages/Rides';
import SignUp from './pages/SignUp';
import RideDetail from './pages/RideDetail';
import CarAdd from './pages/CarAdd';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import EditProfileForm from './components/EditProfileForm';
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
        path: '/rides',
        element: <Rides />
    },
    {
        path: '/rides/:id',
        element: <RideDetail />
    },
    {
        path: '/car-add',
        element: <CarAdd />
    },
    {
        path: '/admin',
        element: <Admin />
    },
    {
        path: '/edit-profile',
        element: <EditProfileForm />
    },
    {
        path: '/contact',
        element: <Contact />
    }
];

import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import { publicRoutes } from './routes'
import Transition from './components/Transition'

function App() {

  return (
    <>
      <Navbar />
      <Transition />
      <Routes>
        {
          publicRoutes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))
        }
      </Routes>
    </>
  )
}

export default App

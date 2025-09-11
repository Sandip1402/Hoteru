import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'

import RootLayout from '../layout/RootLayout.jsx'

import { Home } from './pages/Home.jsx'
import { Experience } from './pages/Experience.jsx'
import { Service } from './pages/Service.jsx'
import { Show } from './pages/Show.jsx'

function App() {

  const Router = createBrowserRouter(
        createRoutesFromElements(
          <Route path='/' element={<RootLayout />} >
            <Route index element={<Home />} />
            <Route path='info/:id' element={<Show />} />
            <Route path='experience' element={<Experience />} />
            <Route path='service' element={<Service />} />
          </Route>
        ))

  return (
      <RouterProvider router={Router}/>
  )
}

export default App

import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'

import RootLayout from '../layout/RootLayout.jsx'
import { Hotel } from './pages/Hotel.jsx'
import { Experience } from './pages/Experience.jsx'
import { Service } from './pages/Service.jsx'
import { Test } from './pages/Test.jsx'
import { NotFound } from './components/NotFound.jsx'
import { Payment } from './components/Payment.jsx'
import { Show } from './pages/Show.jsx'
import { Profile } from './pages/Profile.jsx'
function App() {

  const Router = createBrowserRouter(
        createRoutesFromElements(
          <Route path='/' element={<RootLayout />} errorElement={<NotFound />} >
            <Route index element={<Hotel />} />
            <Route path='hotel' element={<Hotel />} />
            <Route path='hotel/:id' element={<Show />} />
            <Route path='experience' element={<Experience />} />
            <Route path='service' element={<Service />} />
            <Route path='user/:userId' element={<Profile />} />
            <Route path='test' element={<Test />} />
            <Route path='payment/:id' element={<Payment />} />
          </Route>
        ))

  return (
      <RouterProvider router={Router}/>
  )
}

export default App

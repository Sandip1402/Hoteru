import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

import RootLayout from '../layout/RootLayout.jsx'
import { Hotel } from './pages/Hotel.jsx'
import { Experience } from './pages/Experience.jsx'
import { Service } from './pages/Service.jsx'
import { Test } from './pages/Test.jsx'
import { NotFound } from './components/NotFound.jsx'
import { Payment } from './components/Payment.jsx'
import { Show } from './pages/Show.jsx'
import { Profile } from './pages/Profile.jsx'
import { AuthProvider } from './components/AuthContext.jsx'
function App() {

  const Router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />} errorElement={<NotFound />} >
        <Route index element={<Hotel />} />
        <Route path='hotel' element={<Hotel />} />
        <Route path='hotel/:id' element={<Show />} />
        <Route path='experience' element={<Experience />} />
        <Route path='service' element={<Service />} />
        <AuthProvider>
          <Route path='user/:userId' element={<Profile />} />
        </AuthProvider>
        <Route path='payment/:id' element={<Payment />} />
        <Route path='test' element={<Test />} />
      </Route>
    ))

  return (
    <RouterProvider router={Router} />
  )
}

export default App;

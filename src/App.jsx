import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import './App.css'

import LoginScreen from './screens/LoginScreen'
import Layout from './screens/Admin/Layout';
import AllBooks from './screens/Admin/AllBooksScreen';
import IndexAdminScreen from './screens/Admin/IndexAdminScreen';
import CheckoutScreen from './screens/CheckOutScreen';

const App = () => {

  return (
    <HelmetProvider>

<Router>
          <Routes>
            <Route path='' element={<LoginScreen />} exact />
            <Route path='/librarian' element={<Layout/>}  >
            <Route path="" element={<IndexAdminScreen />} />

              <Route path="allBooks" element={<AllBooks />} />
              <Route path="checkout" element={<CheckoutScreen />} />
              <Route path="checkin" element={<CheckoutScreen />} />
              <Route path="transactions" element={<CheckoutScreen />} />

            </Route>
          </Routes>
        </Router>

    </HelmetProvider>
  )
}

export default App

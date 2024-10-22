import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import './App.css'

import LoginScreen from './screens/LoginScreen'
import Layout from './screens/Admin/Layout';
import AllBooks from './screens/Admin/AllBooksScreen';
import IndexAdminScreen from './screens/Admin/IndexAdminScreen';
import CheckoutScreen from './screens/CheckOutScreen';
import AllTransactions from './screens/Admin/AllTransactionScreen';
import IndexPatronScreen from './screens/Patron/IndexPatronScreen';
import PatronLayout from './screens/Patron/PatronLayout';
import AllPatrons from './screens/Admin/AllPatronsScreen';
import LostPasswordScreen from './screens/LostPasswordScreen';
import OverdueScreen from './screens/Admin/OverdueScree';
import ReportScreen from './screens/Admin/ReportScreen';

const App = () => {

  return (
    <HelmetProvider>

<Router>
          <Routes>

          

            <Route path='' element={<LoginScreen />} exact />
            <Route path='lost-password' element={<LostPasswordScreen />} exact />

            <Route path='/librarian' element={<Layout/>}  >
              <Route path="" element={<IndexAdminScreen />} />
              <Route path="allBooks" element={<AllBooks />} />
              <Route path="checkout" element={<CheckoutScreen />} />
              <Route path="checkin" element={<CheckoutScreen />} />
              <Route path="transactions" element={<AllTransactions />} />
              <Route path="patrons" element={<AllPatrons />} />
              <Route path="overdue" element={<OverdueScreen />} />
              <Route path="reports" element={<ReportScreen />} />

              
            </Route>

            <Route path='/patron' element={<PatronLayout/>}  >
              <Route path="" element={<IndexPatronScreen />} />
              <Route path="allBooks" element={<AllBooks />} />

            </Route>

          </Routes>
        </Router>

    </HelmetProvider>
  )
}

export default App

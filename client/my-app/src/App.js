import React from 'react';
import { Routes, Route ,BrowserRouter } from "react-router-dom";
import Dashboard from './Components/Dashboard';
import Login from './Pages/Login';
import Admin from './Pages/Admin';
import Item from './Pages/Item';
import Invoices from './Pages/Invoices';
//import PrivateRoute from './';

function App() {

  const user_role = localStorage.getItem('user_role');

  return (
      <div>
        <BrowserRouter>
          <Routes>
            {/* system_user */}
          {user_role === 'system-user' && (
            <>
              <Route path="/system-user/items" element={<Dashboard uiComponent={<Item />} />} />
              <Route path="/system-user/invoices" element={<Dashboard uiComponent={<Invoices />} />} />
            </>
          )}

          {/* admin */}
          {user_role === 'admin' && (
            <Route path="/admin" element={<Dashboard uiComponent={<Admin />} />} />
          )}

            <Route path="/" element={ <Login/> } />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;

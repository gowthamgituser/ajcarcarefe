import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './redux/store';
import Dashboard from './components/dashboard/dashboard';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Apartment from './components/apartment';
import CustomerDashboard from './components/customerDashboard';

function App() {
  return (
    <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                  <Dashboard/>
              }
            />
            <Route path="/apartment/:id" element={<Apartment/>} />
            <Route path="/customer" element={<CustomerDashboard/>} />
          </Routes>
          <ToastContainer
          position="bottom-center"
          autoClose={4000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
        </BrowserRouter>
    </Provider>
  );
}

export default App;

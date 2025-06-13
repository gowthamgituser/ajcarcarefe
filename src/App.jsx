import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './redux/store';
import Dashboard from './components/dashboard';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

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
            {/* Add more routes as needed */}
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

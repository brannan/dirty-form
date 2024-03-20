import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AddressForm from './AddressForm';

const router = createBrowserRouter([
  { path: '/', element: <AddressForm /> }
]);

function App() {
  return (
    <div className="App">
      {/* <AddressForm /> */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

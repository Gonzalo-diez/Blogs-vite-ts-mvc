import { Route, Routes } from 'react-router-dom';
import './css/App.css'
import Home from './Home/home';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';

function App() {
  return(
    <Router>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/about' element={<div>about</div>}></Route>
        <Route path='/contact' element={<div>contact</div>}></Route>
      </Routes>
    </Router>
  )
}

export default App;

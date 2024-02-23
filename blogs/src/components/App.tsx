import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './css/App.css'
import Home from './Home/home';
import Menu from './Menu/menu';
import 'bootstrap/dist/css/bootstrap.min.css';
import Blog from './Blog/blog';
import Layout from './Footer/layout';
import Login from './Login/login';
import Registro from './Registro/registro';
import User from './User/user';
import AgregarBlog from './Agregar/agregarBlog';

function App() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <Menu isAuthenticated={isAuthenticated} user={user} />
      <Layout>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path='/blogs/:id' element={<Blog />} />
          <Route path='/blogs/protected/agregarBlog' element={<AgregarBlog isAuthenticated={isAuthenticated} user={user} />} />
          <Route path='/usuarios/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path='/usuarios/registro' element={<Registro setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path='/usuarios/protected/:id' element={<User setUser={setUser} user={user} isAuthenticated={isAuthenticated} />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home/home';
import Menu from './Menu/menu';
import Blog from './Blog/blog';
import Layout from './Footer/layout';
import Login from './Login/login';
import Registro from './Registro/registro';
import User from './User/user';
import AgregarBlog from './Blog/Agregar/agregarBlog';
import EditarBlog from './Blog/Editar/editarBlog';
import BorrarBlog from './Blog/Borrar/borrarBlog';
import EditarPerfil from './User/Editar/editarPerfil';
import EditarPassword from './User/Editar/editarPassword';
import BlogCategoria from './Blog/Categoria/blogCategoria';
import AgregarComentario from './Blog/Comentarios/Agregar/agregarComentario';
import EditarComentario from './Blog/Comentarios/Editar/editarComentario';
import BorrarComentario from './Blog/Comentarios/Eliminar/borrarComentario';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <Menu isAuthenticated={isAuthenticated} user={user} />
      <Layout>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path='/blogs/:id' element={<Blog isAuthenticated={isAuthenticated} />} />
          <Route path='/blogs/categoria/:category' element={<BlogCategoria />} />
          <Route path='/blogs/protected/agregarBlog' element={<AgregarBlog isAuthenticated={isAuthenticated} user={user} />} />
          <Route path='/blogs/protected/editarBlog/:id' element={<EditarBlog isAuthenticated={isAuthenticated} />} />
          <Route path='/blogs/protected/borrarBlog/:id' element={<BorrarBlog isAuthenticated={isAuthenticated} />} />
          <Route path='/comentarios/protected/editarComentario/:id' element={<EditarComentario />} />
          <Route path='/comentarios/protected/borrarComentario/:id' element={<BorrarComentario isAuthenticated={isAuthenticated} />} /> 
          <Route path='/usuarios/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path='/usuarios/registro' element={<Registro setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path='/usuarios/protected/:id' element={<User setUser={setUser} user={user} isAuthenticated={isAuthenticated} />} />
          <Route path='/usuarios/protected/editarPerfil/:id' element={<EditarPerfil />} />
          <Route path='/usuarios/protected/cambiarContrasena/:userId' element={<EditarPassword />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App;
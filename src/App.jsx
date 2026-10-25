import { Routes, Route } from 'react-router' //
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
        </Routes>
    )
}

export default App

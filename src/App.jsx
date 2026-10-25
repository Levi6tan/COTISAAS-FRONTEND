import { Routes, Route } from 'react-router' //
import Home from './pages/Home'
import Register from './pages/Register'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/register" element={<Register />}></Route>
        </Routes>
    )
}

export default App

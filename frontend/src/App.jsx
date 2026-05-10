import './App.css'
import Register from './pages/Register'
import DashBoard from './pages/DashBoard'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Register />}/>
      <Route path='/dashboard' element={
        <ProtectedRoute>
          <DashBoard />
        </ProtectedRoute>
        }/>
    </Routes>
      
    </BrowserRouter>
  )
}

export default App

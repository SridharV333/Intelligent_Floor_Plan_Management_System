import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import AddPlan from './AddPlan'
import ModifyPlan from './ModifyPlan'
import DeletePlan from './DeletePlan'
import Signup from './Signup'
import Login from './Login'
import './App.css'

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home />} index />
      <Route path="/home" element={<Home />} />
      <Route path="/add-plan" element={<AddPlan />} />
      <Route path="/modify-plan" element={<ModifyPlan />} />
      <Route path="/delete-plan" element={<DeletePlan />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
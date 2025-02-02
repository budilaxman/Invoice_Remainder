import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/login";  
import Header from "./Components/header";  
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <>
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;

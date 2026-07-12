import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register"
import Login from "./pages/Login"
import Note from "./pages/Note";
import CreateNote from "./pages/CreateNote";

const App = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={<Note/>}/>
      <Route path="/create" element={<CreateNote/>}/>
    </Routes>
  )
}

export default App
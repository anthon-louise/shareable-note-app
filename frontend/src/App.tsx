import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register"
import Login from "./pages/Login"
import Note from "./pages/Note";
import CreateNote from "./pages/CreateNote";
import EditNote from "./pages/EditNote";
import ProtectedRoute from "./pages/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Note />
        </ProtectedRoute>
        } />
      <Route path="/create" element={
        <ProtectedRoute>
          <CreateNote />
        </ProtectedRoute>
        } />
      <Route path="/edit/:id" element={
        <ProtectedRoute>
          <EditNote />
        </ProtectedRoute>
        } />
    </Routes>
  )
}

export default App
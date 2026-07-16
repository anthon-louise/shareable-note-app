import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register"
import Login from "./pages/Login"
import Note from "./pages/Note";
import CreateNote from "./pages/CreateNote";
import EditNote from "./pages/EditNote";
import ProtectedRoute from "./pages/ProtectedRoute";
import Shared from "./pages/Shared";

const App = () => {
  return (
    <Routes>

      {/* register page route */}
      <Route path="/register" element={<Register />} />

      {/* login page route */}
      <Route path="/login" element={<Login />} />

      {/* note page route */}
      <Route path="/" element={
        <ProtectedRoute>
          <Note />
        </ProtectedRoute>
        } />

      {/* create note page route */}
      <Route path="/create" element={
        <ProtectedRoute>
          <CreateNote />
        </ProtectedRoute>
        } />

      {/* edit note page route */}
      <Route path="/edit/:id" element={
        <ProtectedRoute>
          <EditNote />
        </ProtectedRoute>
        } />

      {/* share note page route */}
      <Route path="/:id/shares" element={
        <ProtectedRoute>
          <Shared/>
        </ProtectedRoute>
      }/>
      
    </Routes>
  )
}

export default App
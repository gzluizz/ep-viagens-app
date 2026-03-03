import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Destinos from "./pages/Destinos";
import Transportes from "./pages/Transportes";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
            <Route path="/destinos" element={<Destinos />} />
            <Route path="/transportes" element={<Transportes />} />
        </Routes>
    );
}

export default App;
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Destinos from "./pages/Destinos";
import Transportes from "./pages/Transportes";
import Viagens from "./pages/Viagens";
import Viajantes from "./pages/Viajantes";
import Hospedagens from "./pages/Hospedagens";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/destinos"
                element={
                    <ProtectedRoute>
                        <Destinos />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/viagens"
                element={
                    <ProtectedRoute>
                        <Viagens />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/viajantes"
                element={
                    <ProtectedRoute>
                        <Viajantes />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/hospedagens"
                element={
                    <ProtectedRoute>
                        <Hospedagens />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/transportes"
                element={
                    <ProtectedRoute>
                        <Transportes />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
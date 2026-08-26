import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

// Day 3 will add Login/Register pages here, plus a ProtectedRoute wrapper
// that redirects to /login if there's no token in localStorage.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

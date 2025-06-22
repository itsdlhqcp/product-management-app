import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import "./App.css";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


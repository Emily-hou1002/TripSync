import { useNavigate, Routes, Route } from "react-router-dom"; // Removed BrowserRouter import here
import TravelForm from "./TravelForm";
import "./App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/videos/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="content">
        <header>
          <h1>Welcome to Travel Planner ✈️</h1>
          <p>Your journey starts here! Plan your next adventure effortlessly.</p>
        </header>

        <div className="buttons">
          <button onClick={() => navigate("/plan")}>Start Planning 🚀</button>
          <button onClick={() => alert("Explore Destinations!")}>Explore Destinations 🌍</button>
        </div>

        <footer>
          <p>Made with ❤️ for travelers</p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plan" element={<TravelForm />} />
    </Routes>
  );
}

export default App;

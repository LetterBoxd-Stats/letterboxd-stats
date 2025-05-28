import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatsPage from "./pages/StatsPage";
import RecommenderPage from "./pages/RecommenderPage";
import Navbar from "./components/Navbar";

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/recommender" element={<RecommenderPage />} />
				<Route path="/stats" element={<StatsPage />} />
			</Routes>
		</Router>
	);
}

export default App;

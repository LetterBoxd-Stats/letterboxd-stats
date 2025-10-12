import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import FilmsPage from "./pages/FilmsPage";
import UsersPage from "./pages/UsersPage";
import UserDetailPage from "./pages/UserDetailPage";
import SuperlativesPage from "./pages/SuperlativesPage";
import RecommenderPage from "./pages/RecommenderPage";
import FilmDetailPage from "./pages/FilmDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/films" element={<FilmsPage />} />
				<Route path="/users" element={<UsersPage />} />
				<Route path="/users/:username" element={<UserDetailPage />} />
				<Route path="/superlatives" element={<SuperlativesPage />} />
				<Route path="/recommender" element={<RecommenderPage />} />
				<Route path="/films/:filmId" element={<FilmDetailPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</Router>
	);
}

export default App;

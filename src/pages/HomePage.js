import { Link } from "react-router-dom";

const HomePage = () => (
	<div className="flex flex-col items-center justify-center h-screen text-center px-4">
		<h1 className="text-4xl font-bold mb-4">🎬 Movie Match</h1>
		<p className="text-lg mb-6">
			Dive into your friends’ movie tastes, quirky stats, and smart
			recommendations.
		</p>
		<div className="flex gap-4">
			<Link
				to="/stats"
				className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
			>
				View Stats
			</Link>
			<Link
				to="/recommender"
				className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
			>
				Try Recommender
			</Link>
		</div>
	</div>
);

export default HomePage;

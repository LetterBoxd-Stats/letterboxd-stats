import { Link } from "react-router-dom";

const Navbar = () => (
	<nav className="p-4 bg-black text-white flex gap-4">
		<Link to="/recommender">Recommender</Link>
		<Link to="/stats">Stats</Link>
	</nav>
);

export default Navbar;

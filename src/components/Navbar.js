import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
	return (
		<nav className="navbar">
			<div className="navbar__brand">
				<NavLink to="/" className="navbar__logo">
					Letterboxd Stats
				</NavLink>
			</div>
			<ul className="navbar__links">
				<li>
					<NavLink
						to="/"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						Home
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/films"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						Films
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/users"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						Users
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/superlatives"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						Superlatives
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/recommender"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						Recommender
					</NavLink>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;

import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
	const location = useLocation();
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<nav className="navbar">
			<div className="navbar__brand">
				<NavLink to="/" className="navbar__logo">
					Letterboxd Stats
				</NavLink>
			</div>

			<div className="navbar__menu">
				{/* Navigation Links */}
				<ul className={`navbar__links ${menuOpen ? "active" : ""}`}>
					<li>
						<NavLink
							to="/"
							className={
								location.pathname === "/" ? "active" : ""
							}
							onClick={() => setMenuOpen(false)}
						>
							Home
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/films"
							className={
								location.pathname === "/films" ? "active" : ""
							}
							onClick={() => setMenuOpen(false)}
						>
							Films
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/users"
							className={
								location.pathname === "/users" ? "active" : ""
							}
							onClick={() => setMenuOpen(false)}
						>
							Users
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/superlatives"
							className={
								location.pathname === "/superlatives"
									? "active"
									: ""
							}
							onClick={() => setMenuOpen(false)}
						>
							Superlatives
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/recommender"
							className={
								location.pathname === "/recommender"
									? "active"
									: ""
							}
							onClick={() => setMenuOpen(false)}
						>
							Recommender
						</NavLink>
					</li>
				</ul>

				{/* Hamburger Icon */}
				<button
					className="navbar__toggle"
					onClick={toggleMenu}
					aria-expanded={menuOpen}
					aria-label="Toggle navigation menu"
				>
					<span className={`bar ${menuOpen ? "open" : ""}`}></span>
					<span className={`bar ${menuOpen ? "open" : ""}`}></span>
					<span className={`bar ${menuOpen ? "open" : ""}`}></span>
				</button>
			</div>
		</nav>
	);
}

export default Navbar;

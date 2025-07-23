import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
	return (
		<div className="homepage">
			<header className="homepage__hero">
				<h1>Letterboxd Stats</h1>
				<p>Explore film ratings, user stats, and unique insights.</p>
				<div className="homepage__cta">
					<Link to="/films" className="btn primary">
						Browse Films
					</Link>
					<Link to="/users" className="btn secondary">
						View Users
					</Link>
				</div>
			</header>

			<section className="homepage__features">
				<h2>What You Can Do</h2>
				<div className="features__grid">
					<div className="feature-card">
						<h3>🎬 Films</h3>
						<p>See every film in the database and detailed info.</p>
						<Link to="/films" className="feature-link">
							Explore →
						</Link>
					</div>
					<div className="feature-card">
						<h3>👥 Users</h3>
						<p>View user profiles and their Letterboxd stats.</p>
						<Link to="/users" className="feature-link">
							View →
						</Link>
					</div>
					<div className="feature-card">
						<h3>🏆 Superlatives</h3>
						<p>
							Who rated the highest? Find fun rankings and awards.
						</p>
						<Link to="/superlatives" className="feature-link">
							Check →
						</Link>
					</div>
					<div className="feature-card">
						<h3>🤖 Recommender</h3>
						<p>
							Get film recommendations based on your group's
							taste.
						</p>
						<Link to="/recommender" className="feature-link">
							Try →
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}

export default HomePage;

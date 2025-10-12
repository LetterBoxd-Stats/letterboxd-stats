// components/FilmList.js
import React, { useRef, useState } from "react";
import { getStarsFromRating } from "../../utils/helpers";
import { Link } from "react-router-dom";
import "./FilmList.css";

export default function FilmList({ films }) {
	const [expanded, setExpanded] = useState(new Set());
	const detailsRefs = useRef({}); // { [filmId]: HTMLDivElement }

	const toggle = (id) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	if (!films?.length) return <p>No films found.</p>;

	return (
		<ul className="films-list">
			{films.map((film) => {
				const id = film.film_id;
				const isOpen = expanded.has(id);

				return (
					<li key={id} className="film-item">
						<div className={`film-header clickable ${isOpen ? "expanded" : ""}`} onClick={() => toggle(id)}>
							<span className="film-title">{film.film_title}</span>
							<div className="film-stats-summary">
								<span>⭐ {film.avg_rating != null ? film.avg_rating.toFixed(2) : "N/A"}</span>
								<span>({film.num_ratings ?? 0} ratings)</span>
								<span className={`expand-arrow ${isOpen ? "expanded" : ""}`}>▼</span>
							</div>
						</div>

						{/* Always render the details node, animate via inline styles */}
						<div
							data-film-details
							ref={(el) => (detailsRefs.current[id] = el)}
							style={{
								// animate from 0 -> scrollHeight smoothly, no 'auto' involved
								maxHeight: isOpen ? `${detailsRefs.current[id]?.scrollHeight ?? 0}px` : "0px",
								opacity: isOpen ? 1 : 0,
								overflow: "hidden",
								transition: "max-height 300ms ease, opacity 300ms ease",
								// keep your padding visual change:
								padding: "0 1rem",
								borderTop: isOpen ? "1px solid #333" : "1px solid transparent",
							}}
						>
							<div className="film-meta-data">
								<div>
									Directed by{" "}
									{film.metadata.directors.length > 0 ? film.metadata.directors.join(", ") : "N/A"} (
									{film.metadata.year || "N/A"})
								</div>
								<br />
								<div className="film-description">{film.metadata.description || "N/A"}</div>
							</div>

							<div className="film-likes-watches">
								<p>❤️ Likes: {film.num_likes ?? 0}</p>
								<p>
									🎯 Like Ratio:{" "}
									{film.like_ratio != null ? `${(film.like_ratio * 100).toFixed(1)}%` : "N/A"}
								</p>
								<p>👀 Watches: {film.num_watches ?? 0}</p>
							</div>

							<div className="user-info">
								<h4>Viewers</h4>
								{(film.reviews ?? []).map((review) => (
									<div key={`r-${review.user}-${id}`} className="review">
										<p className="user-review">
											{review.user}:{" "}
											<span className="star-rating">{getStarsFromRating(review.rating)}</span>
											{review.is_liked && " ❤️"}
										</p>
									</div>
								))}

								{(film.watches ?? []).map((watch) => (
									<div key={`w-${watch.user}-${id}`} className="review">
										<p className="user-review">
											{watch.user}: <span className="star-rating">N/A</span>
											{watch.is_liked && " ❤️"}
										</p>
									</div>
								))}
							</div>
							<div className="film-links">
								<p>
									<a
										href={
											film.film_link.startsWith("http")
												? film.film_link
												: `https://${film.film_link}`
										}
										target="_blank"
										rel="noopener noreferrer"
										style={{
											color: "#dd7711",
											textDecoration: "none",
										}}
										onMouseOver={() => {
											// Change text decoration on hover
											const link = document.querySelector(`a[href="${film.film_link}"]`);
											if (link) {
												link.style.textDecoration = "underline";
											}
										}}
										onMouseOut={() => {
											// Revert text decoration when not hovering
											const link = document.querySelector(`a[href="${film.film_link}"]`);
											if (link) {
												link.style.textDecoration = "none";
											}
										}}
									>
										View on Letterboxd →
									</a>
								</p>
								<p>
									<Link to={`/films/${film.film_id}`} className="film-details-link">
										View Details →
									</Link>
								</p>
							</div>
						</div>
					</li>
				);
			})}
		</ul>
	);
}

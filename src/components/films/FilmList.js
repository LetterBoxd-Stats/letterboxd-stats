import React, { useState } from "react";
import { getStarsFromRating } from "../../utils/helpers";
import "./FilmList.css";

export default function FilmList({ films }) {
	const [expandedFilmIds, setExpandedFilmIds] = useState(new Set());

	const toggleExpand = (filmId) => {
		setExpandedFilmIds((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(filmId)) {
				newSet.delete(filmId);
			} else {
				newSet.add(filmId);
			}
			return newSet;
		});
	};

	if (!films || films.length === 0) {
		return <p>No films found.</p>;
	}

	return (
		<ul className="films-list">
			{films.map((film) => {
				const isExpanded = expandedFilmIds.has(film.film_id);

				return (
					<li key={film.film_id} className="film-item">
						{/* Header row */}
						<div
							className={`film-header clickable ${isExpanded ? "expanded" : ""}`}
							onClick={() => toggleExpand(film.film_id)}
						>
							<span className="film-title">{film.film_title}</span>
							<div className="film-stats-summary">
								<span>⭐ {film.avg_rating != null ? film.avg_rating.toFixed(2) : "N/A"}</span>
								<span>({film.num_ratings != null ? film.num_ratings : 0} ratings)</span>
								<span className={`expand-arrow ${isExpanded ? "expanded" : ""}`}>▼</span>
							</div>
						</div>

						{/* Expanded details */}
						{isExpanded && (
							<div className={`film-details ${isExpanded ? "expanded" : ""}`}>
								<p>❤️ Likes: {film.num_likes ?? 0}</p>
								<p>
									🎯 Like Ratio:{" "}
									{film.like_ratio != null ? `${(film.like_ratio * 100).toFixed(1)}%` : "N/A"}
								</p>
								<p>👀 Watches: {film.num_watches ?? 0}</p>
								<p>
									🔗{" "}
									<a
										href={
											film.film_link.startsWith("http")
												? film.film_link
												: `https://${film.film_link}`
										}
										target="_blank"
										rel="noopener noreferrer"
									>
										View on Letterboxd
									</a>
								</p>

								{/* User info */}
								<div className="user-info">
									<h4>Viewers</h4>
									{(film.reviews || []).map((review) => (
										<div key={review.user + "-" + film.film_id} className="review">
											<p className="user-review">
												{review.user}:{" "}
												<span className="star-rating">{getStarsFromRating(review.rating)}</span>
												{review.is_liked && " ❤️"}
											</p>
										</div>
									))}
									{(film.watches || []).map((watch) => (
										<div key={watch.user + "-" + film.film_id} className="review">
											<p className="user-review">
												{watch.user}: <span className="star-rating">N/A</span>
												{watch.is_liked && " ❤️"}
											</p>
										</div>
									))}
								</div>
							</div>
						)}
					</li>
				);
			})}
		</ul>
	);
}

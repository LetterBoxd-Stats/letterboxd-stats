// src/pages/FilmDetailPage.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './FilmDetailPage.css'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; 
import { getStarsFromRating } from '../utils/helpers';

function FilmDetailPage() {
	const { filmId } = useParams();
	const [film, setFilm] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	const API_BASE_URL = process.env.REACT_APP_API_URL;

	useEffect(() => {
		const controller = new AbortController();
		const fetchUser = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`${API_BASE_URL}/films/${filmId}`, {
					signal: controller.signal,
				});
				setFilm(response.data);
			} catch (err) {
				if (err.name !== "CanceledError") {
					setError("Failed to fetch film details");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
		return () => controller.abort();
	}, [API_BASE_URL, filmId]);

	if (loading) return <p className="loading">Loading film details...</p>;
	if (error) return <p className="error">{error}</p>;
	if (!film) return <p>No film found.</p>;
	return (
		<div className="film-details-page">
			<div className="image-container">
					<img src={film.metadata.backdrop_url} alt="Movie Poster" />
			</div>
			<div className="film-details-meta-data">
				<div className="film-detail">
                    <div className="film-detail-meta">
						<div>
                           <h3>{film.film_title}</h3>
						   <h4>Directed by: <span>{film.metadata.directors.join(", ")}</span></h4>
						   <p>{film.metadata.description}</p>
						</div>
                        <div className="film-stats">
							<div>
                               Average letterbox Rating: {film.avg_rating.toFixed(2)}
							</div>
							<div> 
                               Runtime: {film.metadata.runtime} minutes
							</div>
						</div>
				   </div>
				   <div className="film-details-categories">
                     <Tabs>
						<TabList>
							<Tab>Genres</Tab>
							<Tab>Themes</Tab>
							<Tab>Cast</Tab>
							<Tab>Crew</Tab>
							<Tab>Studios</Tab>
						</TabList>

						<TabPanel>
							<div>{film?.metadata.genres.map((genre, index) => (
								<div key={index} className="film">
									<div >{genre}</div>
								</div>
							))}</div>
						</TabPanel>

						<TabPanel>
							<div>{film?.metadata.themes.map((theme, index) => (
								<div key={index} className="film">
									{theme}
								</div>
								))}</div>
						</TabPanel>

						<TabPanel>
							<div>{film?.metadata.actors.map((actor, index) => (
								<div key={index} className="film">
									{actor}
								</div>
								))}</div>
						</TabPanel>

						<TabPanel>
							<table>
								<tbody>
									{film?.metadata.crew.map((cre,index)=>(
										<tr key={index}>
											<td className="film-crew">{cre.role}</td>
											<td>{cre.name}</td>
										</tr>
									))}
								</tbody>
							</table>
						</TabPanel>

						<TabPanel>
							<div>
								{film?.metadata.studios.map((studio,index)=>(
									<div key={index} className="film">
										{studio}
									</div>
								))}
							</div>
						</TabPanel>
					</Tabs>
				   </div>
				</div>
				<div className="film-group-stats">
						<h3 className="group-stats">Group Stats</h3>

						<table>
					      <tbody>
							<tr>
								<td>Average Rating</td>
								<td>{film.avg_rating.toFixed(2)}</td>
							</tr>
							<tr>
								<td>Number of Ratings</td>
								<td>{film.num_ratings}</td>
							</tr>
							<tr>
								<td>Number of Watches</td>
								<td>{film.num_watches}</td>
							</tr>
							<tr>
								<td>Number of Likes</td>
								<td>{film.num_likes}</td>
							</tr>
							<tr>
								<td>Like Ratio</td>
								<td>{film.like_ratio.toFixed(2)}</td>
							</tr>
							<tr>
								<td>Rating Standard Deviation</td>
								<td>{film.stddev_rating ?film.stddev_rating:"N/A" }</td>
							</tr>
							</tbody>							
						 </table>

						<div className="film-viewers">
							<h3 >Viewers</h3>
							  {(film.reviews ?? []).map((review,index) => (
								<div key={`r-${review.user}-${index}`} className="review">
									<p className="user-review">{review.user}:{" "}
										<span className="star-rating">{getStarsFromRating(review.rating)}</span>
										{review.is_liked && " ❤️"}
									</p>
								</div>
							  ))}
						</div>						
				</div>
			</div>
			<div className="view-letterbox">
				<a
				  href={film.film_link.startsWith("http") ? film.film_link :`https://${film.film_link}`}
				  target="_blank"
				  rel="noopener noreferrer"
				  style={{ color: "#dd7711",textDecoration: "none",}}
				  onMouseOver={() => {
				     const link = document.querySelector(`a[href="${film.film_link}"]`);
						if (link) {
							link.style.textDecoration = "underline";
						}
					}}
				  onMouseOut={() => {
					const link = document.querySelector(`a[href="${film.film_link}"]`);
					if (link) {
						link.style.textDecoration = "none";
						}
					}}>
					  View on Letterboxd →
				</a>
			</div>
		</div>
	)
}

export default FilmDetailPage;

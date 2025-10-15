import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "./UserDetailPage.css";

function UserDetailPage() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const controller = new AbortController();
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/users/${username}`, {
                    signal: controller.signal,
                });
                setUser(response.data);
            } catch (err) {
                if (err.name !== "CanceledError") {
                    setError("Failed to fetch user details");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        return () => controller.abort();
    }, [API_BASE_URL, username]);

    if (loading) return <p className="loading">Loading user details...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!user) return <p>No user found.</p>;

    const ratingData = Object.entries(user.stats.rating_distribution || {}).map(([rating, count]) => ({
        rating,
        count,
    }));

    // For pairwise agreement
    const pairwiseData = Object.entries(user.stats.pairwise_agreement || {}).map(([otherUser, stats]) => ({
        otherUser,
        mean_diff: stats.mean_diff != null ? stats.mean_diff.toFixed(3) : "N/A",
        mean_abs_diff: stats.mean_abs_diff != null ? stats.mean_abs_diff.toFixed(3) : "N/A",
        num_shared: stats.num_shared,
    }));

    // For genre stats
    const genreStatsData = Object.entries(user.stats.genre_stats || {}).map(([genre, stats]) => ({
        genre,
        avg_rating: stats.avg_rating != null ? stats.avg_rating.toFixed(3) : "N/A",
        count: stats.count,
        percentage: stats.percentage != null ? stats.percentage.toFixed(3) : "N/A",
        stddev: stats.stddev != null ? stats.stddev.toFixed(3) : "N/A",
    }));

    return (
        <div className="user-details-page">
            <h1>{user.username}</h1>

            {/* Overview */}
            <div className="user-overview">
                <ul>
                    <li>
                        <strong>Average Rating:</strong>{" "}
                        {user.stats.avg_rating != null ? user.stats.avg_rating.toFixed(3) : "N/A"}
                    </li>
                    <li>
                        <strong>Total Ratings:</strong> {user.stats.num_ratings}
                    </li>
                    <li>
                        <strong>Films Watched:</strong> {user.stats.num_watches}
                    </li>
                    <li>
                        <strong>Likes:</strong> {user.stats.num_likes}
                    </li>
                    <li>
                        <strong>Like Ratio:</strong> {(user.stats.like_ratio * 100).toFixed(1)}%
                    </li>
                    <li>
                        <strong>Median Rating:</strong>{" "}
                        {user.stats.median_rating != null ? user.stats.median_rating.toFixed(1) : "N/A"}
                    </li>
                    <li>
                        <strong>Most Common Rating:</strong>{" "}
                        {user.stats.mode_rating != null ? user.stats.mode_rating.toFixed(1) : "N/A"}
                    </li>
                    <li>
                        <strong>Standard Deviation:</strong>{" "}
                        {user.stats.stdev_rating != null ? user.stats.stdev_rating.toFixed(3) : "N/A"}
                    </li>
                </ul>
            </div>

            {/* Rating distribution */}
            <h2>Rating Distribution</h2>
            <div className="chart-container">
                <ResponsiveContainer
                    width="100%"
                    height={300}
                >
                    <BarChart data={ratingData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip
                            formatter={value => [value]}
                            labelFormatter={() => ""}
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                            }}
                            itemStyle={{
                                color: "#333", // dark gray / black text
                                fontSize: "0.9rem",
                            }}
                        />
                        <Bar
                            dataKey="count"
                            fill="#82ca9d"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Pairwise Agreement */}
            <h2>Pairwise Agreement</h2>
            <table className="pairwise-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Mean Difference</th>
                        <th>Mean Absolute Difference</th>
                        <th>Films Shared</th>
                    </tr>
                </thead>
                <tbody>
                    {pairwiseData.map(row => (
                        <tr key={row.otherUser}>
                            <td>
                                <Link to={`/users/${row.otherUser}`}>{row.otherUser}</Link>
                            </td>
                            <td>{row.mean_diff}</td>
                            <td>{row.mean_abs_diff}</td>
                            <td>{row.num_shared}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Genre Stats */}
            <h2>Genre Stats</h2>
            <table className="pairwise-table">
                <thead>
                    <tr>
                        <th>Genre</th>
                        <th>Average Rate</th>
                        <th>Count</th>
                        <th>Percentage</th>
                        <th>STDDEV</th>
                    </tr>
                </thead>
                <tbody>
                    {genreStatsData.map(row => (
                        <tr key={row.genre}>
                            <td>{row.genre}</td>
                            <td>{row.avg_rating}</td>
                            <td>{row.count}</td>
                            <td>{row.percentage}</td>
                            <td>{row.stddev}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Navigation */}
            <Link
                to="/users"
                className="back-link"
            >
                ← Back to Users
            </Link>
        </div>
    );
}

export default UserDetailPage;

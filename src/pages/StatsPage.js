import React, { useEffect, useState } from "react";
import { fetchAllRatings } from "../api/api";
import { calculateStats } from "../utils/stats";
import UserStatsGrid from "../components/UserStatsGrid";

function StatsPage() {
	const [stats, setStats] = useState(null);

	useEffect(() => {
		fetchAllRatings().then(({ data }) => {
			// calculate stats here or call a helper
			setStats(calculateStats(data));
		});
	}, []);

	if (!stats) return <div>Loading stats...</div>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold">Movie Stats</h1>
			<UserStatsGrid stats={stats} />
		</div>
	);
}

export default StatsPage;

const UserStatsGrid = ({ stats }) => (
	<div className="grid grid-cols-2 gap-4 mt-4">
		<div>Favorite Movie: {stats.favoriteMovie}</div>
		<div>Least Favorite Movie: {stats.leastFavoriteMovie}</div>
		<div>Highest Rater: {stats.highestRater}</div>
		<div>Lowest Avg Rater: {stats.lowestAvgRater}</div>
		<div>Most Polarizing User: {stats.mostPolarizing}</div>
	</div>
);

export default UserStatsGrid;

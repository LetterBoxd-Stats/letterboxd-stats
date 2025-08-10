export const getLetterboxdStars = (rating) => {
	if (rating == null) return "N/A";
	let stars = "";
	while (rating >= 1) {
		stars += "★";
		rating -= 1;
	}
	if (rating > 0) {
		stars += "⯪";
	}
	return stars + "☆".repeat(5 - stars.length);
};

// @ts-nocheck

import { DateTime } from 'luxon';

const timeSinceDate = (date: string, shortFormat: boolean = false) => {
	if (!date) {
		return;
	}
	if (!shortFormat) {
		shortFormat = false;
	}
	const currentDate = DateTime.now();
	const pastDate = DateTime.fromISO(date);
	const { years, months, days, hours, minutes } = currentDate
		.diff(pastDate, ['years', 'months', 'days', 'hours', 'minutes'])
		.toObject();
	let string = '';
	if (!shortFormat) {
		if (years > 1) {
			if (years === 1) {
				string = `${years} year ago`;
			} else {
				string = `${years} years ago`;
			}
		} else if (months > 1) {
			if (months === 1) {
				string = `${months} month ago`;
			} else {
				string = `${months} months ago`;
			}
		} else if (days > 1) {
			if (days === 1) {
				string = `${days} day ago`;
			} else {
				string = `${days} days ago`;
			}
		} else if (hours > 1) {
			if (hours === 1) {
				string = `${hours} hour ago`;
			} else {
				string = `${hours} hours ago`;
			}
		} else {
			if (minutes <= 1) {
				string = `just now`;
			} else if (minutes === 1) {
				string = `${Math.round(minutes)} minute ago`;
			} else {
				string = `${Math.round(minutes)} minutes ago`;
			}
		}
	} else {
		if (years > 1) {
			string = `${years} y`;
		} else if (months > 1) {
			string = `${months} m`;
		} else if (days > 1) {
			string = `${days} d`;
		} else if (hours > 1) {
			string = `${hours} h`;
		} else {
			if (minutes <= 1) {
				string = `now`;
			} else {
				string = `${Math.round(minutes)} min`;
			}
		}
	}
	return string;
};

export default timeSinceDate;

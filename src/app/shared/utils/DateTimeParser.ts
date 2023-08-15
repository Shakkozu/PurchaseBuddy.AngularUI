

export class DateTimeParser {
	public static getTimeElapsed(dateString: string): string {
		const date = new Date(dateString);
		return this.getTimeElapsedFromDate(date);
	}

	public static getTimeElapsedFromDate(date: Date): string {
		if (!(date instanceof Date) || isNaN(date.getTime())) {
			return 'Invalid date';
		}

		const now = new Date(Date.UTC(
			new Date().getUTCFullYear(),
			new Date().getUTCMonth(),
			new Date().getUTCDate(),
			new Date().getUTCHours(),
			new Date().getUTCMinutes(),
			new Date().getUTCSeconds(),
			new Date().getUTCMilliseconds()
		));

		const diff = now.getTime() - date.getTime();
		const elapsedSeconds = Math.round(diff / (1000));
		const elapsedMinutes = Math.round(diff / (1000 * 60));
		const elapsedHours = Math.round(diff / (1000 * 60 * 60));
		const elapsedDays = Math.round(diff / (1000 * 60 * 60 * 24));
		const elapsedMonths = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
		const elapsedYears = Math.round(diff / (1000 * 60 * 60 * 24 * 365));

		if (elapsedSeconds < 60)
			return `${ elapsedSeconds } seconds ago`;
		if (elapsedMinutes < 60) {
			return `${ elapsedMinutes } mins ago`;
		} else if (elapsedHours < 24) {
			return `${ elapsedHours } hours ago`;
		} else if (elapsedDays < 30) {
			return `${ elapsedDays } days ago`;
		} else if (elapsedMonths < 12) {
			return `${ elapsedMonths } months ago`;
		} else {
			return `${ elapsedYears } years ago`;
		}
	}
}

export class SorterHelper {
	static sort<T>(items: T[], property: keyof T): T[] {
		return items.sort((a, b) => {
			const valueA = a[property];
			const valueB = b[property];

			if (valueA < valueB) {
				return -1; // a should come before b
			} else if (valueA > valueB) {
				return 1; // a should come after b
			} else {
				return 0; // a and b are equal in terms of the property value
			}
		});
	}
}

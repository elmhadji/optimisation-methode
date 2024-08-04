

export function calculateDistance (cityOne: [number, number], cityTwo: [number, number]): number {
	return Math.sqrt((cityTwo[1] - cityOne[1]) ** 2 + (cityTwo[0] - cityOne[0]) ** 2)
}
  
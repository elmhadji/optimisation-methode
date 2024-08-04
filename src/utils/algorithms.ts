import { calculateDistance } from "./distance"

interface Result {
  bestRoad: number[];
  distance: number;
}

// Glutton Algorithm
export function gluttonAlgorithm(cityNumber: number, citiesCoordinates: [number, number][]): Result {
  let bestRoad: number[] = [];
  let distance = 0;
  let visited = [0];
  let remaining = Array.from({ length: cityNumber - 1 }, (_, i) => i + 1);

  while (remaining.length > 0) {
    const currentCity = visited[visited.length - 1];
    let nearestCity = remaining[0];
    let minDistance = calculateDistance(citiesCoordinates[currentCity], citiesCoordinates[nearestCity]);

    remaining.forEach(nextCity => {
      const newDistance = calculateDistance(citiesCoordinates[currentCity], citiesCoordinates[nextCity]);
      if (newDistance < minDistance) {
        minDistance = newDistance;
        nearestCity = nextCity;
      }
    });

    visited.push(nearestCity);
    remaining = remaining.filter(city => city !== nearestCity);
    distance += minDistance;
  }

  distance += calculateDistance(citiesCoordinates[visited[visited.length - 1]], citiesCoordinates[0]);
  visited.push(0);
  bestRoad = visited;

  return { bestRoad, distance };
}

// Genetic Algorithm
export function geneticAlgorithm(cityNumber: number, citiesCoordinates: [number, number][], populationSize = 20, generations = 100): Result {
  const population: number[][] = initializePopulation(cityNumber, populationSize);
  let bestRoad: number[] = [];
  let bestDistance = Infinity;

  for (let generation = 0; generation < generations; generation++) {
    population.forEach(individual => {
      const distance = calculateTotalDistance(individual, citiesCoordinates);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestRoad = individual.slice();
      }
    });
    population.sort((a, b) => calculateTotalDistance(a, citiesCoordinates) - calculateTotalDistance(b, citiesCoordinates));
    const newPopulation: number[][] = [];

    for (let i = 0; i < populationSize / 2; i++) {
      const [parent1, parent2] = selectParents(population);
      const [child1, child2] = crossover(parent1, parent2);
      newPopulation.push(mutate(child1), mutate(child2));
    }

    population.splice(0, populationSize, ...newPopulation);
  }

  // Ensure the tour returns to the starting city
  bestRoad.push(bestRoad[0]);
  bestDistance = calculateTotalDistance(bestRoad, citiesCoordinates);

  return { bestRoad, distance: bestDistance };
}


// Simulated Annealing
export function simulatedAnnealing(cityNumber: number, citiesCoordinates: [number, number][], initialTemperature = 1000, coolingRate = 0.003): Result {
  let currentRoad = Array.from({ length: cityNumber }, (_, i) => i);
  let currentDistance = calculateTotalDistance(currentRoad, citiesCoordinates);
  let bestRoad = currentRoad.slice();
  let bestDistance = currentDistance;
  let temperature = initialTemperature;

  while (temperature > 1) {
    const newRoad = mutate(currentRoad.slice());
    const newDistance = calculateTotalDistance(newRoad, citiesCoordinates);

    if (acceptanceProbability(currentDistance, newDistance, temperature) > Math.random()) {
      currentRoad = newRoad;
      currentDistance = newDistance;
    }

    if (currentDistance < bestDistance) {
      bestDistance = currentDistance;
      bestRoad = currentRoad.slice();
    }

    temperature *= 1 - coolingRate;
  }

  // Ensure the tour returns to the starting city
  bestRoad.push(bestRoad[0]);
  bestDistance = calculateTotalDistance(bestRoad, citiesCoordinates);

  return { bestRoad, distance: bestDistance };
}


// Utility Functions

function mutate(road: number[]): number[] {
  const index1 = Math.floor(Math.random() * road.length);
  let index2 = Math.floor(Math.random() * road.length);
  while (index1 === index2) {
    index2 = Math.floor(Math.random() * road.length);
  }
  [road[index1], road[index2]] = [road[index2], road[index1]];
  return road;
}

function initializePopulation(cityNumber: number, populationSize: number): number[][] {
  return Array.from({ length: populationSize }, () => shuffle(Array.from({ length: cityNumber }, (_, i) => i)));
}

function shuffle(array: number[]): number[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function calculateTotalDistance(road: number[], citiesCoordinates: [number, number][]): number {
  let distance = 0;
  for (let i = 0; i < road.length - 1; i++) {
    distance += calculateDistance(citiesCoordinates[road[i]], citiesCoordinates[road[i + 1]]);
  }
  distance += calculateDistance(citiesCoordinates[road[road.length - 1]], citiesCoordinates[road[0]]);
  return distance;
}

function selectParents(population: number[][]): [number[], number[]] {
  // Simple selection mechanism (e.g., tournament selection)
  return [population[0], population[1]]; // Placeholder: Implement a proper selection method
}

function crossover(parent1: number[], parent2: number[]): [number[], number[]] {
  const length = parent1.length;
  const start = Math.floor(Math.random() * length);
  const end = start + Math.floor(Math.random() * (length - start));

  const child1 = Array(length).fill(-1);
  const child2 = Array(length).fill(-1);

  for (let i = start; i < end; i++) {
    child1[i] = parent1[i];
    child2[i] = parent2[i];
  }

  fillChild(child1, parent2);
  fillChild(child2, parent1);

  return [child1, child2];
}

function fillChild(child: number[], parent: number[]) {
  const length = parent.length;
  let parentIndex = 0;
  for (let i = 0; i < length; i++) {
    if (child[i] === -1) {
      while (child.includes(parent[parentIndex])) {
        parentIndex++;
      }
      child[i] = parent[parentIndex];
    }
  }
}

function acceptanceProbability(currentDistance: number, newDistance: number, temperature: number): number {
  if (newDistance < currentDistance) {
    return 1.0;
  }
  return Math.exp((currentDistance - newDistance) / temperature);
}

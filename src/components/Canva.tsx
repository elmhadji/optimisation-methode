import { useRef, useState, useEffect } from 'react'
import City from './City'
import Road from './Road'

// type AlgorithmType = (cityNumber: number, cities: [number, number][]) => { bestRoad: number[] };

interface CanvaProps {
	title: string,
	cityNumber: number,
	randomPosition: [number, number][],
	algorithm: Function
}

export default function Canva({title, cityNumber, randomPosition, algorithm}: CanvaProps) {
	const canvasRef = useRef<SVGSVGElement|null> (null)
	const [citiesCoordinates, setCitiesCoordinates] = useState <[number, number][]> ([])
	const [bestRoad, setBestRoad] = useState<number[]>([])
	const [distance, setdistance] = useState<number>(0)

	useEffect(()=>{
		if (cityNumber >= 4 && randomPosition.length >0){
			generateCities(cityNumber)
		}
	}, [cityNumber])

	function generateCities (number: number) {
		const width = canvasRef.current?.getClientRects && canvasRef.current.getClientRects().length > 0 ? canvasRef.current.getClientRects()[0].width : 800
		const height = canvasRef.current?.getClientRects && canvasRef.current.getClientRects().length > 0 ? canvasRef.current.getClientRects()[0].height : 800
		const newCities: [number, number][] = randomPosition.map((position) =>[
			position[0] * width,
			position[1] * height
		])
		// const newCities:[number, number][] = Array.from({ length: number }, () => [
		//   Math.random() * width,
		//   Math.random() * height,
		// ])
	
		setCitiesCoordinates(newCities)
		const { bestRoad, distance } = algorithm(number, newCities)
		setBestRoad(bestRoad)
		setdistance(distance)
	  }

	return (
		<div className='flex flex-col items-center m-5 lg:w-1/3 '>
			<span className='text-lg color-white'>
				{title}
			</span>
			<svg 
				ref={canvasRef}
				className='w-full border-2 border-solid lg:grow'
				>
				{citiesCoordinates.map((coords, index) => (
					<City 
						key={index} 
						x={coords[0]} 
						y={coords[1]}
						start_point={index==0} 
						/>
				))}
				{bestRoad.length > 0 && bestRoad.map((cityIndex, idx) => {
					if (idx < bestRoad.length - 1) {
					const [x1, y1] = citiesCoordinates[cityIndex];
					const [x2, y2] = citiesCoordinates[bestRoad[idx + 1]]
					return (
						<Road 
						key={idx} 
						start_point_x={x1} 
						start_point_y={y1} 
						end_point_x={x2} 
						end_point_y={y2} 
						color="white" 
						/>
					)
					}
					return null;
				})}
        	</svg>
			<div>
				Total Distance is: <span className='font-bold'>{distance}</span>
			</div>
		</div>
		
	)
}
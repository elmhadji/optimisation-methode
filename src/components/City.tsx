
interface CityProps {
  x: number
  y: number
  start_point ?: boolean 
}

export  default function City ({ x, y, start_point=false }: CityProps) {
	return (
		<circle cx={x} cy={y} r={10} fill= {start_point ? "green" :"red"}/>
	  )
}




interface RoadProps {
  start_point_x: number
  start_point_y: number
  end_point_x: number
  end_point_y: number
  color: string
}

export default function Road({ start_point_x, start_point_y, end_point_x, end_point_y ,color }:RoadProps) {
	return (
		<line 
			x1={start_point_x} 
			y1={start_point_y} 
			x2={end_point_x} 
			y2={end_point_y} 
			stroke={color} 
			strokeWidth={5} 
			/>
	  )
}

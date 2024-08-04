import { useState } from 'react'
import { gluttonAlgorithm, geneticAlgorithm, simulatedAnnealing } from '../utils/algorithms'
import Canva from './Canva'


export default function Simulation () {
  
  const [cityNumberInput, setCityNumberInput] = useState<number>(10)
  const [cityNumber, setCityNumber] = useState<number>(0)
	const [randomPosition, setRandomPosition] = useState <[number, number][]> ([])
 
  const optimisationMethodes = [
    {id:0, name: 'Glutton Algorithm', algorithm: gluttonAlgorithm},
    {id:1, name: 'Genetic Algorithm', algorithm: geneticAlgorithm},
    {id:2, name: 'Simulated Annealing', algorithm: simulatedAnnealing},
  ]
  
  function handleStart (){
    if (cityNumberInput != 0 && cityNumberInput >= 4 ) {
      setRandomPosition(
        Array.from({ length: cityNumberInput }, () => [
            Math.random() ,
            Math.random() ,
          ])
      )
      setCityNumber(cityNumberInput)
    }else if(cityNumberInput == 0 || cityNumberInput < 4){
      alert('City Number must be a positive number and greater then 3')
    }
  }
  
  function handleInput (newCityNumber:string){
    const re = /^[0-9\b]+$/;
    if (newCityNumber === '' || re.test(newCityNumber)) {
      setCityNumberInput(Number(newCityNumber))
   }
  }


  return (
    <div className='flex flex-col min-h-screen'>
      {/* Left SideBare */}
      <div className='flex flex-col items-center gap-3 p-2 md:flex-row'>
        {/* City Number Input */}
        <div className='flex flex-col items-center gap-2 md:flex-row md:gap-3'>
          <label className='text-sm md:text-base md:w-2/3'>City Number</label>
          <input 
            className='w-1/2 text-center text-gray-600 rounded-md md:w-fit'
            value={cityNumberInput} 
            onChange={(e)=> handleInput(e.target.value)} 
            />
        </div>
        <button 
          className='w-1/2 p-2 text-sm border-2 border-solid rounded-md md:w-fit md:text-base hover:bg-blue-600'
          onClick={handleStart} 
          >Start Simulation</button>
      </div>
      {/* Right SideBare */}
      <div className='flex flex-col min-h-screen place-content-center lg:flex-row'>
        {
          optimisationMethodes.map((method) => (
            <Canva
              key={method.id}
              title={method.name}
              cityNumber={cityNumber}
              randomPosition={randomPosition}
              algorithm={method.algorithm}
              />
          ))
        }
      </div>
    </div>
  );
};


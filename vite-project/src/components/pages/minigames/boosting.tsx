import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import Typewriter from 'typewriter-effect';
import '../styling/boosting.scss'
// import { useNuiEvent } from "../../hooks/useNuiEvent";
// import { fetchNui } from "../../utils/fetchNui";
// import Logo from '../Images/SecBypass.png'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const generateTargetNumbers = () => {
	const targetNumbers: string[] = [];
	while (targetNumbers.length < 6) {
		const randomNumber = Math.floor(Math.random() * 99) + 1;
		const twoDigitNumber = randomNumber < 10 ? `0${randomNumber}` : `${randomNumber}`;
		if (!targetNumbers.includes(twoDigitNumber)) {
			targetNumbers.push(twoDigitNumber);
		}
	}
	return targetNumbers;
}

const SecBypass: React.FC<{}> = () => {

	const [page, setPage] = useState('hack')

	const [canHack] = useState(true)
	// useNuiEvent<boolean>('setCanHack', setCanHack)

	const [loaded, setLoaded] = useState(true)
	const [allowStart, setAllowStart] = useState(true)

	const [security] = useState(100)


	const [currentTarget, setCurrentTarget] = useState<number>(0)
	const [targetNumbers, setTargetNumbers] = useState<String[]>(['10'])

	const [currentRow, setCurrentRow] = useState<number>(1)
	const [currentColumn, setCurrentColumn] = useState<number>(1)

	const [grid, setGrid] = useState<String[][]>([])

	const [originalTimer] = useState(30000)
	const [timer, setTimer] = useState(30000);

	const [updateInterval] = useState({ min: 3000, max: 5000 }) // Needs to be set from Lua for difficulty

	const [refreshRate, setRefreshRate] = useState(0)
	const [lastUpdated, setLastUpdated] = useState(0)

	const [maxChances] = useState(5)
	const [chances, setChances] = useState(5)

	const [error, setError] = useState(false)

	const calculateTimePercentage = () => {
		const totalTime = originalTimer;
		return (timer / totalTime) * 100;
	};

	useEffect(() => {

		setChances(maxChances)

	}, [maxChances])

	useEffect(() => {

		setRefreshRate(Math.random() * (updateInterval.max - updateInterval.min) + updateInterval.min)

	}, [updateInterval])

	useEffect(() => {

		const diff = lastUpdated - timer

		if (diff < 0 || diff > refreshRate) {
			setLastUpdated(timer)
		}

	}, [timer])

	const generateGrid = (targetNumbers: any) => {
		const gridRows = 6;
		const rowLength = 17;
		const totalGridSize = gridRows * rowLength;

		// Generate a list of available positions
		const positions = Array.from({ length: totalGridSize }, (_, index) => ({
			row: Math.floor(index / rowLength),
			col: index % rowLength,
		}));

		// Shuffle the positions
		const shuffledPositions = positions.sort(() => 0.5 - Math.random());

		// Create a map with target numbers placed in random positions
		const targetNumberMap = new Map(
			shuffledPositions.slice(0, targetNumbers.length).map((pos, index) => [`${pos.row}-${pos.col}`, targetNumbers[index]])
		);

		// Generate the new grid
		const newGrid = Array.from({ length: gridRows }, (_, rowIndex) =>
			Array.from({ length: rowLength }, (_, colIndex) => {
				const targetNumber = targetNumberMap.get(`${rowIndex}-${colIndex}`);
				if (targetNumber) {
					return targetNumber;
				} else {
					let randomNumber;
					do {
						randomNumber = Math.floor(Math.random() * 99) + 1;
						const twoDigitNumber = randomNumber < 10 ? `0${randomNumber}` : `${randomNumber}`;
						randomNumber = twoDigitNumber;
					} while (targetNumbers.includes(randomNumber));
					return randomNumber;
				}
			})
		);

		return newGrid;
	};

	const getCurrentValue = () => {

		const value = grid[currentRow - 1][currentColumn - 1];
		return value

	}

	useEffect(() => {

		setRefreshRate(Math.random() * (updateInterval.max - updateInterval.min) + updateInterval.min)
		setGrid(generateGrid(targetNumbers))

	}, [lastUpdated])

	useEffect(() => {

		if (!loaded) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'E' || event.key === 'e') {

				if (allowStart && security > 0 && canHack && page === 'loading') {
					setPage('hack')
				}

			} else if (event.key === 'W' || event.key === 'w') {
				setCurrentRow(currentRow === 1 ? 6 : currentRow - 1)
			} else if (event.key === 'S' || event.key === 's') {
				setCurrentRow(currentRow === 6 ? 1 : currentRow + 1)
			} else if (event.key === 'A' || event.key === 'a') {
				setCurrentColumn(currentColumn === 1 ? 17 : currentColumn - 1)
			} else if (event.key === 'D' || event.key === 'd') {
				setCurrentColumn(currentColumn === 17 ? 1 : currentColumn + 1)
			} else if (event.key === 'Enter') {

				if (page !== 'hack') return

				if (getCurrentValue() === targetNumbers[currentTarget]) {

					setCurrentTarget(currentTarget + 1)
					setChances(maxChances)

					if (currentTarget === 5) {

						// fetchNui('updateSecurity', true).then((result: number) => {

						// 	setSecurity(result)
						// 	setPage('loading')
						// 	setError(false)

						// })

					}

					return

				}

				const currentChances = chances
				const newChances = currentChances - 1

				const newError = newChances === 0

				setError(newError)
				setChances(newChances)

				if (newError) {

					// fetchNui('updateSecurity', false).then((result) => {
					// 	setSecurity(result)
					// 	setPage('loading')
					// })

				}
				

			}
		};

		window.addEventListener('keydown', handleKeyDown);

		// Clean up the event listener when the component unmounts or dependencies change
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};

	}, [loaded, currentColumn, currentRow, chances, security, page])

	useEffect(() => {

		if (page !== "hack") return;

		const targetNumbs = generateTargetNumbers();

		setTargetNumbers(targetNumbs);
		setGrid(generateGrid(targetNumbs));
		setCurrentTarget(0);

		console.log(originalTimer)
		setTimer(originalTimer);

		setCurrentRow(1);
		setCurrentColumn(1);
		setChances(maxChances);

		let startTime: number | null = null;
		const totalTime = originalTimer; // 

		let shouldUpdateTimer = true;

		const updateTimer = (timestamp: number) => {
			if (!shouldUpdateTimer) return;

			if (startTime === null) {
				startTime = timestamp;
			}

			const elapsedTime = timestamp - startTime;
			const remaining = totalTime - elapsedTime;
			setTimer(remaining <= 0 ? 0 : remaining);

			if (remaining > 0) {
				requestAnimationFrame(updateTimer);
			} else {
				setError(true)
				setPage('loading')
			}
		};

		requestAnimationFrame(updateTimer);

		return () => {
			startTime = null;
			shouldUpdateTimer = false;
		};

	}, [page]);


	return (

		<AnimatePresence>

			{<motion.div
				key="secBypassContainer"
				className="appContainer"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>

				<div className='secBypass'>

					<div className='header'>

						<div className='logoName'>
							{/* <img src={Logo} /> */}
							<span>SecBypass</span>
						</div>

						<div className='appControls'>

							{/* <svg onClick={() => { props.setActiveApp('') }} width="17" height="2" viewBox="0 0 17 2" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect x="0.0810547" y="0.539062" width="16" height="0.8" rx="0.4" fill="white" />
							</svg>

							<svg onClick={() => { props.setActiveApp('') }} width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect x="0.707275" width="16" height="0.8" rx="0.4" transform="rotate(45 0.707275 0)" fill="white" />
								<rect x="0.192627" y="11.4844" width="16" height="0.8" rx="0.4" transform="rotate(-45 0.192627 11.4844)" fill="white" />
							</svg> */}


						</div>

					</div>

					{ page === 'spinner' && <motion.div key="spinnerContainer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='spinnerContainer'  >
						{/* <FontAwesomeIcon icon={faSpinner} spin color='grey' fontSize={100} /> */}
					</motion.div>}

					{page === 'loading' && <motion.div key="loadingTextContainer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='loadingTextContainer'  >

						{!loaded ? <Typewriter
							onInit={(typewriter) => {
								typewriter.changeDelay(25) // 75
									.typeString('INITIALIZING SYSTEM SETUP...')
									.pauseFor(2000)
									.typeString('<br />SUCCESSFULLY INITIALIZED...')
									.pauseFor(2000)
									.typeString(`<br />SECURITY ECU MODEL:   <span style="color: #80ABFF; padding-left: 24px" >${canHack ? 'ANGEE' : 'UNKNOWN'}</span>`)
									.pauseFor(canHack ? 2000 : 0)
									.changeDelay(5)
									.typeString(canHack ? '<br /><span style="opacity: 0.45" >--------------------------------------------------------------------------------------------------------------------------------------</span>' : '')
									.changeDelay(25)
									.pauseFor(canHack ? 2000 : 0)
									.typeString(canHack ? `<br />SECURITY PROTOCOL INTEGRITY  <span style="color: #00FF00" }} >${security}%</span>` : '')
									.callFunction(() => {
										setAllowStart(canHack)
										setLoaded(canHack)
									})
									.start();
							}}
						/> : <>

							<span>INITIALIZING SYSTEM SETUP..</span>
							<span>SUCCESSFULLY INITIALIZED...</span>
							<span>SECURITY ECU MODEL:<span style={{ color: '#80ABFF', paddingLeft: 24 }} >{ canHack ? 'ANGEE' : 'UNKNOWN' }</span></span>
							{ canHack && <span style={{ opacity: 0.45 }} >--------------------------------------------------------------------------------------------------------------------------------------</span> }
							{ canHack && <span>SECURITY PROTOCOL INTEGRITY  <span style={{ color: '#00FF00' }} >{security}%</span></span> }
							{(security !== 100 || error) && <span>SECURITY PROTOCOL  <span style={{ color: error ? '#EE1041' : '#00FF00' }} >{error ? 'BYPASS FAILED' : security <= 0 ? 'DISABLED' : 'BYPASSED'}</span></span>}

						</>}

						{(allowStart && security > 0 && canHack) && <span style={{ marginTop: 'auto', alignSelf: 'center', textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }} >PRESS <span style={{ color: '#00FF00' }} >E</span> TO ACCESS SECURITY PROTOCOL</span>}
						{(security === 0 && allowStart) && <span style={{ marginTop: 'auto', alignSelf: 'center', textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }} >LOSE THE COPS</span>}

					</motion.div>}

					{

						page === 'hack' && <motion.div key="hackContainer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='hackContainer'>
							<div className='targetList'>

								{targetNumbers.map((target, index: number) => {
									const chancePercentage = maxChances === 1 ? 1 : index === currentTarget ? chances / maxChances : 1
									return <span key={'target-' + index} style={{ color: index < currentTarget ? '#00FF00' : chancePercentage < 0.3 ? '#EE1041' : chancePercentage < 0.6 ? '#EEA210' : '#505256' }} >{index === 0 ? '' : '.'}{target}</span>
								})}

							</div>
							<div className='timer'>
								{Array(70).fill(null).map((_, index) => {
									const percentage = calculateTimePercentage();
									const currentIndexPercentage = (index / 70) * 100;

									return (
										<span
											key={'slash-' + index}
											style={{
												color: currentIndexPercentage <= percentage ? timer <= 7500 ? '#EE1041' : '#00FF00' : 'white',
												transition: 'color 0.2s ease',
											}}
										>
											/
										</span>
									);
								})}
							</div>
							<div className='numberGrid'>

								{grid.map((data, row) => {

									const isRow = (row + 1) === currentRow

									return <div style={{ display: 'flex', flexDirection: 'row' }} >
										{data.map((num, column) => {
											const isColumn = (column + 1) === currentColumn
											return <span key={'grid-' + row + '-' + column} style={{ width: 32, color: (isColumn && isRow) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)', transition: 'color 0.2s ease' }} >{num}</span>
										})}
									</div>

								})}

							</div>

							<div className='controls'><span style={{ color: '#00FF00' }} >W S A D</span> TO NAVIGATE <span style={{ color: '#00FF00' }} >ENTER</span> TO CONFIRM</div>

						</motion.div>



					}

				</div>

			</motion.div>}

		</AnimatePresence>


	);
}

export default SecBypass;
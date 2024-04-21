import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
	const [availablePlaces, setAvailablePlaces] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	useEffect(() => {
		async function fetchPlaces() {
			setIsLoading(true);
			try {
				const places = await fetchAvailablePlaces();

				navigator.geolocation.getCurrentPosition((position) => {
					const sortedPlaces = sortPlacesByDistance(
						places,
						position.coords.latitude,
						position.coords.longitude
					);
					setAvailablePlaces(sortedPlaces);
					setIsLoading(false);
				});
			} catch (error) {
				setError({ message: error.message || 'Could not fetch places' });
				setIsLoading(false);
			}
		}

		fetchPlaces();
	}, []);

	return (
		<>
			{error && <Error title='An error occured!' message={error.message} />}
			{!error && (
				<Places
					title='Available Places'
					places={availablePlaces}
					isLoading={isLoading}
					loadingText='Fetching places data...'
					fallbackText='No places available.'
					onSelectPlace={onSelectPlace}
				/>
			)}
		</>
	);
}

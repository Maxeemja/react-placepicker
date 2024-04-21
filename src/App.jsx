import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import Error from './components/Error.jsx';
import { fetchUserPlaces, updateUserPlaces } from './http.js';

function App() {
	const selectedPlace = useRef();

	const [userPlaces, setUserPlaces] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const [errorUpdatingPlace, setErrorUpdatingPlace] = useState(null);

	const [modalIsOpen, setModalIsOpen] = useState(false);

	useEffect(() => {
		async function fetchPlaces() {
			setIsLoading(true);
			try {
				const response = await fetchUserPlaces();
				setUserPlaces(response);
			} catch (error) {
				setError({
					message: error.message || 'Failed to fetch user places'
				});
			}

			setIsLoading(false);
		}

		fetchPlaces();
	}, []);

	function handleStartRemovePlace(place) {
		setModalIsOpen(true);
		selectedPlace.current = place;
	}

	function handleStopRemovePlace() {
		setModalIsOpen(false);
	}

	async function handleSelectPlace(selectedPlace) {
		setUserPlaces((prevPickedPlaces) => {
			if (!prevPickedPlaces) {
				prevPickedPlaces = [];
			}
			if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
				return prevPickedPlaces;
			}
			return [selectedPlace, ...prevPickedPlaces];
		});

		try {
			await updateUserPlaces([selectedPlace, ...userPlaces]);
		} catch (error) {
			setUserPlaces(userPlaces);
			setErrorUpdatingPlace({
				message: error.message || 'Failed to update places'
			});
		}
	}

	const handleRemovePlace = useCallback(
		async function handleRemovePlace() {
			setUserPlaces((prevPickedPlaces) =>
				prevPickedPlaces.filter(
					(place) => place.id !== selectedPlace.current.id
				)
			);

			try {
				await updateUserPlaces(
					userPlaces.filter((place) => place.id !== selectedPlace.current.id)
				);
			} catch (error) {
				setUserPlaces(userPlaces);
				setErrorUpdatingPlace({
					message: error.message || 'Failed to update places'
				});
			}

			setModalIsOpen(false);
		},
		[userPlaces]
	);

	function handleError() {
		setErrorUpdatingPlace(null);
	}

	return (
		<>
			<Modal open={errorUpdatingPlace} onClose={handleError}>
				{errorUpdatingPlace && (
					<Error
						title='Error'
						message={errorUpdatingPlace.message}
						onConfirm={handleError}
					/>
				)}
			</Modal>

			<Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
				<DeleteConfirmation
					onCancel={handleStopRemovePlace}
					onConfirm={handleRemovePlace}
				/>
			</Modal>

			<header>
				<img src={logoImg} alt='Stylized globe' />
				<h1>PlacePicker</h1>
				<p>
					Create your personal collection of places you would like to visit or
					you have visited.
				</p>
			</header>
			<main>
				{error && <Error title='Error' message={error.message} />}
				{!error && (
					<Places
						title="I'd like to visit ..."
						fallbackText='Select the places you would like to visit below.'
						places={userPlaces}
						loadingText='Fetching your places...'
						isLoading={isLoading}
						onSelectPlace={handleStartRemovePlace}
					/>
				)}

				<AvailablePlaces onSelectPlace={handleSelectPlace} />
			</main>
		</>
	);
}

export default App;
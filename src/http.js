export async function fetchAvailablePlaces() {
	const response = await fetch('https://react-placepicker.onrender.com/places');
	const data = await response.json();

	if (!response.ok) {
		throw new Error('Failed to fetch places');
	}

	return data.places;
}

export async function updateUserPlaces(places) {
	const response = await fetch('https://react-placepicker.onrender.com/user-places', {
		method: 'PUT',
		body: JSON.stringify({ places: places }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error('Failed to update user data.');
	}

	return data.message;
}

export async function getUserPlaces() {
	const response = await fetch('https://react-placepicker.onrender.com/user-places');
	const data = await response.json();

	if (!response.ok) {
		throw new Error('Failed to update user data.');
	}

	return data.places;
}

export async function fetchUserPlaces() {
	const response = await fetch('https://react-placepicker.onrender.com/user-places');
	const data = await response.json();

	if (!response.ok) {
		throw new Error('Failed to fetch user places');
	}

	return data.places;
}

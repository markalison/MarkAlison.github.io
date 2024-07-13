const apiKey = "36b4cc2e9ad94626a72956c3115e6c5b";

// Function to fetch game suggestions
async function fetchGameSuggestions(gameName) {
    try {
        const response = await fetch(`https://api.rawg.io/api/games?search=${gameName}&key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        return data.results.slice(0, 5); // Limiting to first 5 results for simplicity
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Function to handle input change and fetch suggestions
async function handleInputChange() {
    const inputElement = document.getElementById('gameSearch');
    const inputValue = inputElement.value.trim();

    if (inputValue.length === 0) {
        clearSuggestions();
        return;
    }

    const suggestions = await fetchGameSuggestions(inputValue);
    displaySuggestions(suggestions);
}

// Function to display suggestions in a list
function displaySuggestions(suggestions) {
    const suggestionsElement = document.getElementById('suggestions');
    suggestionsElement.innerHTML = '';

    suggestions.forEach(game => {
        const li = document.createElement('li');
        li.textContent = game.name;
        li.addEventListener('click', () => {
            fetchGameDetails(game.name);
            clearSuggestions();
        });
        suggestionsElement.appendChild(li);
    });
}

// Function to clear suggestions
function clearSuggestions() {
    const suggestionsElement = document.getElementById('suggestions');
    suggestionsElement.innerHTML = '';
}

// Function to fetch game details
async function fetchGameDetails(gameName) {
    try {
        const response = await fetch(`https://api.rawg.io/api/games?search=${gameName}&key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        const game = data.results[0]; // Assuming the first result is what we want
        displayGameDetails(game);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('gameDetails').innerText = 'Error fetching game details. Check console for more information.';
    }
}

// Function to display game details
function displayGameDetails(game) {
    const gameDetailsElement = document.getElementById('gameDetails');
    if (game) {
        gameDetailsElement.innerHTML = `
            <h2>${game.name}</h2>
            <img src="${game.background_image}" alt="${game.name} Cover Art" style="max-width: 300px;">
            <p>Released: ${game.released}</p>
            <p>Rating: ${game.rating}</p>
            <p>Platforms: ${game.platforms.map(platform => platform.platform.name).join(', ')}</p>
        `;
    } else {
        gameDetailsElement.innerText = 'Game not found.';
    }
}

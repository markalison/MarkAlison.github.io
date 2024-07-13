const apiKey = "36b4cc2e9ad94626a72956c3115e6c5b"

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
                    <p>Released: ${game.released}</p>
                    <p>Rating: ${game.rating}</p>
                    <p>Platforms: ${game.platforms.map(platform => platform.platform.name).join(', ')}</p>
                `;
    } else {
        gameDetailsElement.innerText = 'Game not found.';
    }
}

// Example usage
const gameName = "The Legend of Zelda: Breath of the Wild";
fetchGameDetails(gameName);
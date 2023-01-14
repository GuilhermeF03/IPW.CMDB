window.addEventListener('load', loadHandler);


let deleteGroupButton;

function loadHandler() {
    deleteGroupButton = document.querySelector('#delete-movie');
    deleteGroupButton.addEventListener('click', deleteMovieHandler);
}

async function deleteMovieHandler(event) {
    try {
        const totalRuntime = document.querySelector('#total-runtime')
        const totalMovies = document.querySelector('#total-movies')
        const movieId = deleteGroupButton.value
        const userToken = document.getElementById('user-token').value;
        const groupId = document.getElementById('group-id').value
        const movie = document.getElementById(`movie-${movieId}`)
        const runtime = document.getElementById(`runtime-${movieId}`).value

        await fetch(`/api/groups/${groupId}/${movieId}`, {
            method: 'DELETE',
            headers: {'Accept': 'application/json',
            "Authorization": `Bearer ${userToken}`
        }
        });
        
        // Update page
        totalRuntime.innerHTML = parseInt(totalRuntime.innerHTML) - parseInt(runtime);
        totalMovies.innerHTML = parseInt(totalMovies.innerHTML) - 1
        movie.remove()
    } catch (error) {
        console.log(error)
    }
 
}
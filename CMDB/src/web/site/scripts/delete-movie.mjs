window.addEventListener('load', loadHandler);

function loadHandler() {
    const deleteGroupButton = document.querySelector('#delete-movie');
    deleteGroupButton.addEventListener('click', deleteMovieHandler);
}

async function deleteMovieHandler(event) {

    try {
        const movieId = event.target.dataset.movieId;
        const groupId = event.target.dataset.groupId;
        // TODO: to be checked
        const row = document.getElementById(`#movie_${movieId}`);
        const response = await fetch(`api/groups/${groupId}/${movieId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            window.location.href = '/groups';
        }
    } catch (error) {
        console.log(error)
    }
 
}
window.addEventListener('load', loadHandler);

function loadHandler() {
    const deleteButtons = document.querySelectorAll('.delete-group');
    
    deleteButtons.forEach(b => b.addEventListener('click', deleteGroupHandler))
}

async function deleteGroupHandler() {
    try {
        const userToken = document.getElementById('user-token');
        const groupId = this.id.split(':')[1]
        const group = document.querySelector(`#${groupId}`)
        const options = {
            method : "DELETE",
            headers : {
            "Accept" : "application/json",
            "Authorization" : `Bearer ${userToken}`
           }
        }
        const response = await fetch(`/api/groups/${groupId}`,options)
        console.log("I AM GROUP:\n"+JSON.stringify(response));
        group.remove();
    } catch (error) {
        console.log(error)
    }
}
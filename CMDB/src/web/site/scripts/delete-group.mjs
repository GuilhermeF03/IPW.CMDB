window.addEventListener('load', loadHandler);

function loadHandler() {
    const deleteButtons = document.querySelectorAll('.delete-group');
    
    deleteButtons.forEach(b => b.addEventListener('click', deleteGroupHandler))
}

async function deleteGroupHandler() {
    try {
        const userToken = document.getElementById('user-token').value;
        const groupId = this.id.split(':')[1]
        const group = document.getElementById(`group-${groupId}`)
        const options = {
            method : "DELETE",
            headers : {
            "Accept" : "application/json",
            "Authorization" : `Bearer ${userToken}`
           }
        }
        await fetch(`/api/groups/${groupId}`,options)
        group.remove();
    } catch (error) {
        console.log(error)
    }
}
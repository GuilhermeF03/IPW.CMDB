window.addEventListener('load', loadHandler)

function loadHandler(){
    const buttonUpdate = document.querySelector('#update')
    buttonUpdate.addEventListener('click', updateGroupHandler)
}
async function updateGroupHandler(){
    const userToken = document.getElementById('user-token').value;
    
    const groupId = document.getElementById('group-id').value
    const groupName = document.getElementById('group-name').value 
    const groupDescription = document.getElementById('group-description').value.trim()

    await fetch(`/api/groups/${groupId}`, {
        method: "PUT",
        body : JSON.stringify({
            name : groupName,
            description: groupDescription
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json",
            "Authorization" : `Bearer ${userToken}`
        },
    })
}
window.addEventListener('load', loadHandler)

let groupName ;
let buttonParent
let buttonUpdate;
let groupDescription ;

function loadHandler(){
    buttonParent = document.querySelector('.update-group')
    buttonUpdate = document.querySelector('#update')
    groupName = document.getElementById('group-name')
    groupDescription = document.getElementById('group-description')

    buttonUpdate.addEventListener('click', updateGroupHandler)
    buttonUpdate.remove()
    groupName.addEventListener('change',buttonHandler)
    groupDescription.addEventListener('change',buttonHandler)
    
}
const buttonHandler = () => buttonParent.appendChild(buttonUpdate)

async function updateGroupHandler(){
    const userToken = document.getElementById('user-token').value;
    
    const groupId = document.getElementById('group-id').value
    groupName = groupName.value 
    groupDescription = groupDescription.value

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
    buttonUpdate.remove()
}
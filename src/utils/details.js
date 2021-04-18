const userData = []
const rooms = []

const addUser = (username, room, id) => {
    if(username.trim()=='' || room.trim()==''){
        return {
            error: 'Enter valid username and room!'
        }
    }
    const userdata = {
        id,
        username,
        room:room.toLowerCase()
    }
    
    userData.push(userdata)
    rooms.push(userdata.room)
    return { userdata }
}
// adding all users and their room and getting by room

const generateTime = (message, username) => {
    const msg_time = {
        message,
        username,
        timeHours:new Date().getHours(),
        timeMinutes:new Date().getMinutes()
    }
    return { msg_time }
}

const generateTimeDrawing = (drawingURL, username) => {
    const user = {
        url: drawingURL,
        username,
        timeHours:new Date().getHours(),
        timeMinutes:new Date().getMinutes()
    }
    return { user }
}

const getUser = (id) => {
    const user  = userData.filter((user) => user.id == id)
    return user 
}
// const a = addUser('rithika','ROOM', 2)
// console.log(a)
// console.log(userData)

// const b = getUser(2)
// console.log(b)

module.exports = {
    addUser,
    generateTime,
    generateTimeDrawing,
    getUser,
}

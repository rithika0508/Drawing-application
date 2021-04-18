const socket = io()

//Mustache templates
const message_template = document.querySelector('#message-template').innerHTML
const drawing_template = document.querySelector('#drawing-template').innerHTML
// const firstbar_template = document.querySelector('#firstbar-template').innerHTML

//inserting templates to these
const messages = document.querySelector('.messages')
const firstbar = document.querySelector('#firstbar')


//route details
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})
//starts from here
socket.emit('join', { username, room }, (error) => {
    
    if(error) {
        alert(error)
        location.href = '/'
    }
    socket.emit('sendMessagePersonal', { message: `Welcome ${username}` ,username})
    socket.emit('sendMessageBroadcast', {message: `${username} joined!`, username})
})


// All socket.on functions
// appending messages
socket.on('sendToAll', (data) => {

    const html = Mustache.render(message_template, {
        text: data.msg_time.message,
        username: data.msg_time.username,
        time: data.msg_time.timeHours+':'+data.msg_time.timeMinutes
    })
    messages.insertAdjacentHTML('beforeend', html)
})
// appending drawing images
socket.on('sendToAll-drawing', (data) => {
    console.log(data)
    const html = Mustache.render(drawing_template, {
        username:data.user.username,
        time: data.user.timeHours+':'+data.user.timeMinutes,
        image_URL: data.user.url
    })
    messages.insertAdjacentHTML('beforeend', html)
})

// socket.on('userData', (data) => {
//     console.log(data)
//     const html = Mustache.render(firstbar_template, {
//         room: data[0].room,
//         users:data[0].username
//     })
//     firstbar.innerHTML = html
// })

//getting the input and appending it to message template
const form = document.querySelector('#message-form')
const input_message = form.querySelector('input')
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', { message, username })
    input_message.value='';
})








// function for drawing
const paintFunction = (e) => {
    const canvas = document.querySelector('#canvas')
    const ctx = canvas.getContext('2d')
    //paint color
    ctx.strokeStyle = "orange"

    ctx.lineWidth = 20;
    ctx.lineCap = "round"
    const coordinates = canvas.getBoundingClientRect()
    ctx.beginPath()
    // ctx.moveTo(e.clientX-375, e.clientY-68)
    ctx.lineTo(e.clientX - coordinates.left, e.clientY-coordinates.top)
    ctx.stroke()

}


// drawing part event listeners

canvas.addEventListener('click', (e) => {
canvas.addEventListener('mousemove', paintFunction)
})

canvas.addEventListener('dblclick', (e) => {
canvas.removeEventListener('mousemove',paintFunction)
})
// sending the canva drawing to server
const finishdrawing = () => {
const dataURL = document.getElementById('canvas').toDataURL()
socket.emit('sendDrawing', {url: dataURL, username})
}
//clearing canva drawing
const clearDrawing = document.querySelector('#clear-btn')
clearDrawing.addEventListener('click', (e) => {
document.getElementById('canvas').getContext('2d').clearRect(0, 0, 565, 565)
console.log('cleared canva!')
})
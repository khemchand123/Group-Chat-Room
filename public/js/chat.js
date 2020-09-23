const socket = io()


//Element
const $messageForm = document.querySelector('#message-form')
const $messageFromInput = $messageForm.querySelector('input')
const $messageFromButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

//Option
const { username, room} = Qs.parse(location.search, { ignoreQueryPrefix : true})

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locationMessageTemplate, {
        url
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        if(error){
            return console.log(error)
        }
        console.log(`Message Delivered!`)
    });
})

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation not supported for your browser')
    }

    navigator.geolocation.getCurrentPosition((positon) => {

        socket.emit('sendLocation', {
            latitude: positon.coords.latitude,
            longitude: positon.coords.longitude
        }, () =>{
            console.log('Location Shared')
        })
    })
})


socket.emit('join', { username, room })
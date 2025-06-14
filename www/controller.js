function DisplayMessage(message) {
    $(".siri-message").text(message);         // Directly update the text of <p>
    $('.siri-message').textillate('start');   // Animate it with textillate
}

eel.expose(DisplayMessage);
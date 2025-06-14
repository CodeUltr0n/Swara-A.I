let siriWaveInstance = null;
let siriMessageShown = false;
let micActive = false;


$(document).ready(function () {
    // --- Welcome Footer ---
    // Initially hide  
    try {
            eel.playmic();
        } catch (err) {
            console.error("Eel call failed:", err);
        }
    $('#welcomeFooter').hide();

    // Show with fade-in animation
    $('#welcomeFooter').fadeIn(500).textillate({
        autoStart: true,
        loop: false,
        minDisplayTime: 2000,
        in: {
             effect: 'flipInX',
             delayScale: 1.5,
             delay: 50,
             sync: false,
             shuffle: true
            },
        out: {
             effect: 'flipOutX',
             sync: true
             }
            
    });

    // Manually trigger out animation after delay if needed
    // Trigger out after 5 seconds
setTimeout(() => {
    $('#welcomeFooter').textillate('out');
}, 5000);

$('#MicBtn').on('click', function () {
        if (!siriMessageShown) {
            $('.siri-message').show();
            setTimeout(() => {
                $('.siri-message').fadeOut();
            }, 14000);
            siriMessageShown = true;
        }

        $('#oval').attr('hidden', true);
        $('#SiriWave').removeAttr('hidden');
        eel.allCommand()();

        if (!siriWaveInstance) {
            siriWaveInstance = new SiriWave({
                container: document.getElementById('siri-container'),
                width: 600,
                height: 200,
                style: 'ios9',
                speed: 0.12,
                amplitude: 1,
                autostart: true,
            });
        }
    });
  document.addEventListener('keydown', function (e) {
    console.log("KeyDown:", e.key, "Meta:", e.metaKey, "Ctrl:", e.ctrlKey);
    if (e.key.toLowerCase() === 'k' && e.metaKey) {
        console.log("⌘ + K detected");
        eel.playAssistantSound();
        $("#Oval").attr("hidden", true);
        $("#SiriWave").attr("hidden", false);
        eel.allCommands()();
        e.preventDefault(); // prevent browser default (just in case)
    }
});
function toggleMic() {
    if (!micActive) {
        // === Turn ON mic ===
        if (!siriMessageShown) {
            $('.siri-message').show();
            setTimeout(() => {
                $('.siri-message').fadeOut();
            }, 14000);
            siriMessageShown = true;
        }

        $('#oval').attr('hidden', true);
        $('#SiriWave').removeAttr('hidden');
        eel.allCommand()();

        if (!siriWaveInstance) {
            siriWaveInstance = new SiriWave({
                container: document.getElementById('siri-container'),
                width: 600,
                height: 200,
                style: 'ios9',
                speed: 0.12,
                amplitude: 1,
                autostart: true,
            });
        } else {
            siriWaveInstance.start();
        }

        micActive = true;
    } else {
        // === Turn OFF mic ===
        $('#SiriWave').attr('hidden', true);
        $('#oval').removeAttr('hidden');

        if (siriWaveInstance) {
            siriWaveInstance.stop();
        }

        eel.stopListening && eel.stopListening();  // optional: stop mic/audio if defined
        micActive = false;
    }
}

$('#MicBtn').on('click', toggleMic);

document.addEventListener('keydown', function (e) {
    if (e.key.toLowerCase() === 'j' && e.metaKey) {
        console.log("⌘ + J detected");
        eel.playAssistantSound();
        toggleMic();
        e.preventDefault();
    }
});

  function playAssistant(message) {
    if (message != "") {
        $('#SiriWave').attr('hidden', false);
        $('#oval').attr('hidden', true);

        if (!siriWaveInstance) {
            siriWaveInstance = new SiriWave({
                container: document.getElementById('siri-container'),
                width: 600,
                height: 200,
                style: 'ios9',
                speed: 0.12,
                amplitude: 1,
                autostart: true,
            });
        } else {
            siriWaveInstance.start();
        }

        eel.allCommand(message);
        $('#chatbox').val("");
        $('#MicBtn').attr('hidden', false);
        $('#sendbtn').attr('hidden', true);
    }
}

  function showHideButton(message){
       if (message.length == 0 ) {
           $('#MicBtn').attr('hidden',false);
           $('#sendbtn').attr('hidden',true);
       } else {
             $('#MicBtn').attr('hidden',true);
             $('#sendbtn').attr('hidden',false);
       }
  }
  
    $('#chatbox').keyup(function () { 
         
        let message = $('#chatbox').val();
        showHideButton(message)
    });

     $('#sendbtn').click(function () { 
        
        let message = $('#chatbox').val();
        playAssistant(message)
     });
    
      $("#chatbox").keypress(function (e) {
          let key = e.which || e.keyCode;
          if (key === 13) {
              e.preventDefault(); // Prevent default form submission or new line
              let message = $("#chatbox").val();
              playAssistant(message); // corrected function name (was PlayAssistant)
          }
      });


  
// Expose bot response display function
eel.expose(DisplayBotMessage);
function DisplayBotMessage(message) {
    console.log("🤖 Bot says:", message);
    $('.siri-message').hide().text(message).fadeIn();
    setTimeout(() => {
        $('.siri-message').fadeOut();
    }, 14000);
}
      
});
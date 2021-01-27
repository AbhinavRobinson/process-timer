// Required variables
var session_seconds = '00'
var session_minutes = 25
var on_short_break = false
var on_long_break = false
var streak = 0
// Audio files
var click_sound = new Audio('click.mp3')
var bell = new Audio('bell.mp3')

// Starting template for the timer
function template() {
	document.getElementById('minutes').innerHTML = session_minutes
	document.getElementById('seconds').innerHTML = session_seconds
}

function start_timer() {
	click_sound.play()

	// Change the minutes and seconds to starting time
	session_minutes = 24
	session_seconds = 59

	// Add the seconds and minutes to the page
	document.getElementById('minutes').innerHTML = session_minutes
	document.getElementById('seconds').innerHTML = session_seconds

	// Start the countdown
	var minutes_interval = setInterval(minutesTimer, 60000)
	var seconds_interval = setInterval(secondsTimer, 1000)

	// Functions
	// Function for minute counter
	function minutesTimer() {
		session_minutes = session_minutes - 1
		document.getElementById('minutes').innerHTML = session_minutes
	}

	// Function for second counter
	function secondsTimer() {
		session_seconds = session_seconds - 1
		document.getElementById('seconds').innerHTML = session_seconds

		// Check if the seconds and minutes counter has reached 0
		// If reached 0 then end the session
		if (session_seconds <= 0) {
			if (session_minutes <= 0) {
				if (on_short_break) {
					session_minutes = 24
					session_seconds = 59
					document.getElementById('done').innerHTML = 'Back to work'
					document.getElementById('done').classList.add('show_message')
					document.getElementById('minutes').innerHTML = session_minutes
					document.getElementById('seconds').innerHTML = session_seconds
					on_short_break = false
					return
				} else if (on_long_break) {
					session_minutes = 24
					session_seconds = 59
					document.getElementById('done').innerHTML = 'Back to the grind'
					document.getElementById('done').classList.add('show_message')
					document.getElementById('minutes').innerHTML = session_minutes
					document.getElementById('seconds').innerHTML = session_seconds
					on_long_break = false
					streak = 0
					return
				}
				streak++
				if (streak >= 5) {
					document.getElementById('done').innerHTML = 'Session Completed and streak done!! Take a long break'
					document.getElementById('done').classList.add('show_message')
					bell.play()
					session_minutes = 14
					session_seconds = 59
					document.getElementById('minutes').innerHTML = session_minutes
					document.getElementById('seconds').innerHTML = session_seconds
					on_long_break = true
				} else {
					document.getElementById('done').innerHTML = 'Session Completed!! Take a break'
					document.getElementById('done').classList.add('show_message')
					bell.play()
					session_minutes = 4
					session_seconds = 59
					document.getElementById('minutes').innerHTML = session_minutes
					document.getElementById('seconds').innerHTML = session_seconds
					on_short_break = true
				}
			}
			//session_seconds = 60;
		}
	}
}

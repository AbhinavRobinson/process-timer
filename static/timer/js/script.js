// Select Pomodoro display to edit timer content
const pomodoroDisplay = document.querySelector(".timer-display");

// Select start, pause & stop buttons
const startButton = document.querySelector(".start");
const stopButton = document.querySelector(".stop");
const pauseButton = document.querySelector(".pause");

// Select fields to increment total work & break sessions
const workSession = document.querySelector(".work-sessions");
const breakSession = document.querySelector(".break-sessions");

// Select div to display session type
const sessionType = document.querySelector(".session-type");
const buttonGroup = document.querySelector(".button-group");
// display initial timer state at the start
const progressBar = new ProgressBar.Circle(pomodoroDisplay, {
  strokeWidth: 2,
  text: {
    value: "25:00"
  },
  trailColor: "rgba(255, 255, 255, 0.308)",
  color: "#f3f3f3",
  svgStyle: {
    // Important: make sure that your container has same
    // aspect ratio as the SVG canvas. See SVG canvas sizes above.
    width: "85%"
  }
});

// Set a flag to check if pomodoro was paused
let timerRunning = true;

// Set a flag to check if timer was stopped
let timerStopped = false;

// set pomodoro interval time
let timerSeconds = 1500;
let currentSessionTime = 1500;

// set break interval time
let breakSeconds = 300;

// set break interval time
let longBreakSeconds = 900;

//Set a variable to calculate time spent in current session
let timeSpent = 0;

// Declare  variable for setInterval
let timerInterval = null;

// Declare a variable to define type of session
let type = "work";

// set variables for counting total work & break sessions
let totalWorkSessions = 0;
let totalBreakSessions = 0;

// set function to initialize buttons at start of application
function initializeButtons() {
  startButton.style.display = "block";
  stopButton.style.display = "none";
  pauseButton.style.display = "none";
}

// set a function to toggle session type
const toggleSession = function() {
  if (type === "work") {
    type = "break";
    if(totalWorkSessions%4==0&&totalBreakSessions>0)
      currentSessionTime = longBreakSeconds;
    else
      currentSessionTime = breakSeconds;
  } else {
    type = "work";
    currentSessionTime = timerSeconds;
  }
};

// Calculate session progress for progressbar
const calculateSessionProgress = () => {
  // calculate the completion rate of this session
  let sessionTotalTime = type === "work" ? timerSeconds : totalWorkSessions%4==0?longBreakSeconds:breakSeconds;
  return timeSpent / sessionTotalTime;
};

// set a display timer function to format time-
const displayTimer = function(timeInput) {
  // convert seconds into minutes
  var minutes = Math.floor(timeInput / 60);
  var remainingSeconds = timeInput - minutes * 60;
  // format time for single digit prepend by 0
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  // return display time
  progressBar.text.innerText = `${minutes}:${remainingSeconds}`;
  workSession.textContent = totalWorkSessions;
  breakSession.textContent = totalBreakSessions;
  sessionType.textContent = type;
};

// Reset timer Seconds
const resetTimerSeconds = function() {
  currentSessionTime = 1500;
};

// Set a time function to run pomodoro intervals
const timerStart = function() {
  if (timerRunning) {
    timerInterval = setInterval(function() {
      timeSpent++;
      currentSessionTime--;
      displayTimer(currentSessionTime);
      progressBar.set(calculateSessionProgress());
      if (currentSessionTime < 0) {
        if (type === "work") {
          totalWorkSessions++;
        } else {
          totalBreakSessions++;
        }
        timeSpent = 0;
        timerRunning = false;
        clearInterval(timerInterval);
        toggleSession();
        initializeButtons();
        displayTimer(currentSessionTime);
        progressBar.set(calculateSessionProgress());
      }
    }, 1000);
  }
};

// Set a function to pause timer
const pauseTimer = function() {
  if (!timerRunning) {
    clearInterval(timerInterval);
  }
};

// set a function to stop timer
const stopTimer = function() {
  if (timerStopped) {
    timeSpent = 0;
    clearInterval(timerInterval);
    resetTimerSeconds();
    displayTimer(currentSessionTime);
    progressBar.set(calculateSessionProgress());
    timerStopped = false;
  }
};

// Listen for clicks on the document
document.addEventListener("click", function(event) {
  // Start pomodoro on click on start button
  if (event.target.classList.contains("start")) {
    timerRunning = true;
    timerStart();
    startButton.style.display = "none";
    pauseButton.style.display = "block";
    stopButton.style.display = "block";
  }

  if (event.target.classList.contains("pause")) {
    timerRunning = false;
    pauseTimer();
    pauseButton.style.display = "none";
    startButton.style.display = "block";
  }

  if (event.target.classList.contains("stop")) {
    timerStopped = true;
    stopTimer();
    initializeButtons();
  }
});

// display buttons at the start of timer
initializeButtons();

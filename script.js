
/* =====================================
   LOGIN / SIGNUP SWITCH
===================================== */

const loginToggle = document.getElementById("loginToggle");
const signupToggle = document.getElementById("signupToggle");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const passwordError = document.getElementById("passwordError");


function showLogin() {

    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");

    loginToggle.classList.add("active");
    signupToggle.classList.remove("active");

    passwordError.style.display = "none";
}


function showSignup() {

    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    signupToggle.classList.add("active");
    loginToggle.classList.remove("active");

    passwordError.style.display = "none";
}


loginToggle.addEventListener("click", showLogin);
signupToggle.addEventListener("click", showSignup);


/* =====================================
   SHOW / HIDE PASSWORD
===================================== */

const signupPassword = document.getElementById("signupPassword");
const showPasswordBtn = document.getElementById("showPassword");
const eyeIcon = document.getElementById("eyeIcon");


const openEye = `
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/>
    <circle cx="12" cy="12" r="3"/>
`;

const closedEye = `
    <path d="M3 3l18 18"/>
    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
    <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-3.1 4.2"/>
    <path d="M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7a10.5 10.5 0 0 0 4.2-.9"/>
`;


showPasswordBtn.addEventListener("click", () => {

    const passwordVisible = signupPassword.type === "text";

    if (passwordVisible) {

        signupPassword.type = "password";

        eyeIcon.innerHTML = openEye;

        showPasswordBtn.setAttribute("aria-label", "Show password");

        showPasswordBtn.setAttribute("aria-pressed", "false");

    } else {

        signupPassword.type = "text";

        eyeIcon.innerHTML = closedEye;

        showPasswordBtn.setAttribute("aria-label", "Hide password");

        showPasswordBtn.setAttribute("aria-pressed", "true");

    }

});


/* =====================================
   PASSWORD VALIDATION
===================================== */

function isValidPassword(password) {

    const exactlyEightCharacters = password.length === 8;

    const hasUppercase = /[A-Z]/.test(password);

    const hasLowercase = /[a-z]/.test(password);

    const hasNumber = /[0-9]/.test(password);

    const hasSpecialCharacter = /[@#$!%&*]/.test(password);

    const onlyAllowedCharacters = /^[A-Za-z0-9@#$!%&*]+$/.test(password);


    return (
        exactlyEightCharacters &&
        hasUppercase &&
        hasLowercase &&
        hasNumber &&
        hasSpecialCharacter &&
        onlyAllowedCharacters
    );

}


/* =====================================
   SIGNUP SUBMIT
===================================== */

signupForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const password = signupPassword.value;


    if (!isValidPassword(password)) {

        passwordError.style.display = "block";

        return;

    }


    passwordError.style.display = "none";

    alert("Password is valid!");

});


/* =====================================
   LOGIN SUBMIT
===================================== */

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    alert("Login interface working!");

});


/* =====================================
   FORGOT PASSWORD
===================================== */

const forgotPassword = document.getElementById("forgotPassword");

forgotPassword.addEventListener("click", (event) => {

    event.preventDefault();

    alert("Password recovery will be added later.");

});


/* =====================================
   SOUND SYSTEM
===================================== */

const music = document.getElementById("bgMusic");

const soundOrb = document.getElementById("soundOrb");

const soundPanel = document.getElementById("soundPanel");

const musicToggle = document.getElementById("musicToggle");

const volumeSlider = document.getElementById("volumeSlider");

const volumeValue = document.getElementById("volumeValue");

const muteButton = document.getElementById("muteButton");

const closeSoundPanel = document.getElementById("closeSoundPanel");


/* INITIAL SETTINGS */

music.volume = 0.25;

let musicEnabled = false;

let muted = false;

let previousVolume = 25;


/* =====================================
   OPEN / CLOSE SOUND PANEL
===================================== */

soundOrb.addEventListener("click", () => {

    const isOpen = soundPanel.classList.toggle("open");

    soundOrb.setAttribute("aria-expanded", isOpen);

});


closeSoundPanel.addEventListener("click", () => {

    soundPanel.classList.remove("open");

    soundOrb.setAttribute("aria-expanded", "false");

});


/* =====================================
   MUSIC ON / OFF
===================================== */

musicToggle.addEventListener("click", async () => {

    if (!musicEnabled) {

        try {

            await music.play();

            musicEnabled = true;

            soundOrb.classList.add("playing");

            musicToggle.textContent = "ON";

            musicToggle.classList.add("on");

            musicToggle.setAttribute("aria-pressed", "true");

        } catch (error) {

            musicToggle.textContent = "OFF";

            console.error("Music could not play:", error);

            alert("Music could not play. Check whether ambient.mp3 exists.");

        }

    } else {

        music.pause();

        musicEnabled = false;

        soundOrb.classList.remove("playing");

        musicToggle.textContent = "OFF";

        musicToggle.classList.remove("on");

        musicToggle.setAttribute("aria-pressed", "false");

    }

});


/* =====================================
   VOLUME SLIDER
===================================== */

volumeSlider.addEventListener("input", () => {

    const volume = Number(volumeSlider.value);

    volumeValue.textContent = volume + "%";

    music.volume = volume / 100;


    if (volume > 0) {

        previousVolume = volume;

        muted = false;

        muteButton.textContent = "MUTE";

        muteButton.setAttribute("aria-pressed", "false");

    } else {

        muted = true;

        muteButton.textContent = "UNMUTE";

        muteButton.setAttribute("aria-pressed", "true");

    }

});


/* =====================================
   MUTE / UNMUTE
===================================== */

muteButton.addEventListener("click", () => {

    if (!muted) {

        previousVolume = Number(volumeSlider.value);

        music.volume = 0;

        volumeSlider.value = 0;

        volumeValue.textContent = "0%";

        muted = true;

        muteButton.textContent = "UNMUTE";

        muteButton.setAttribute("aria-pressed", "true");

    } else {

        volumeSlider.value = previousVolume;

        music.volume = previousVolume / 100;

        volumeValue.textContent = previousVolume + "%";

        muted = false;

        muteButton.textContent = "MUTE";

        muteButton.setAttribute("aria-pressed", "false");

    }

});


/* =====================================
   CLOSE PANEL OUTSIDE CLICK
===================================== */

document.addEventListener("click", (event) => {

    if (!event.target.closest(".sound-system")) {

        soundPanel.classList.remove("open");

        soundOrb.setAttribute("aria-expanded", "false");

    }

});


/* =====================================
   ESCAPE KEY CLOSES PANEL
===================================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        soundPanel.classList.remove("open");

        soundOrb.setAttribute("aria-expanded", "false");

    }

});

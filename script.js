
import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    updateProfile,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const loginToggle = document.getElementById("loginToggle");
const signupToggle = document.getElementById("signupToggle");

const passwordError = document.getElementById("passwordError");

// ---------------- FORM SWITCHING ----------------

function showLogin() {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");

    loginToggle.classList.add("active");
    signupToggle.classList.remove("active");
}

function showSignup() {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    signupToggle.classList.add("active");
    loginToggle.classList.remove("active");
}

loginToggle.addEventListener("click", showLogin);
signupToggle.addEventListener("click", showSignup);

// ---------------- PASSWORD VALIDATION ----------------

function isValidPassword(password) {
    return (
        password.length > 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[@#$!%&*]/.test(password)
    );
}

// ---------------- SHOW / HIDE PASSWORD ----------------

const showPasswordButton = document.getElementById("showPassword");
const signupPassword = document.getElementById("signupPassword");

if (showPasswordButton && signupPassword) {
    showPasswordButton.addEventListener("click", () => {
        const visible = signupPassword.type === "text";

        signupPassword.type = visible ? "password" : "text";

        showPasswordButton.setAttribute(
            "aria-pressed",
            String(!visible)
        );

        showPasswordButton.setAttribute(
            "aria-label",
            visible ? "Show password" : "Hide password"
        );
    });
}

// ---------------- SIGN UP ----------------

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = signupPassword.value;

    passwordError.style.display = "none";

    if (!isValidPassword(password)) {
        passwordError.textContent = "Invalid password";
        passwordError.style.display = "block";
        return;
    }

    try {
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await updateProfile(credential.user, {
            displayName: name
        });

        await setDoc(doc(db, "users", credential.user.uid), {
            name: name,
            email: email,
            level: 1,
            xp: 0,
            createdAt: new Date().toISOString()
        });

        alert("Character created successfully!");

        window.location.href = "dashboard.html";

    } catch (error) {
        alert(error.message);
    }
});

// ---------------- LOGIN ----------------

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    try {
        await setPersistence(
            auth,
            rememberMe
                ? browserLocalPersistence
                : browserSessionPersistence
        );

        await signInWithEmailAndPassword(auth, email, password);

        window.location.href = "dashboard.html";

    } catch (error) {
        alert("Invalid email or password.");
    }
});

// ---------------- FORGOT PASSWORD ----------------

document.getElementById("forgotPassword").addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginUsername").value.trim();

    if (!email) {
        alert("Enter your email first.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent. Check your inbox.");

    } catch (error) {
        alert(error.message);
    }
});

// ---------------- AMBIENT MUSIC ----------------

const bgMusic = document.getElementById("bgMusic");
const soundOrb = document.getElementById("soundOrb");
const soundPanel = document.getElementById("soundPanel");
const musicToggle = document.getElementById("musicToggle");
const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");
const muteButton = document.getElementById("muteButton");
const closeSoundPanel = document.getElementById("closeSoundPanel");

let musicOn = false;
let muted = false;

bgMusic.volume = 0.25;

soundOrb.addEventListener("click", () => {
    soundPanel.classList.toggle("open");

    soundOrb.setAttribute(
        "aria-expanded",
        soundPanel.classList.contains("open")
    );
});

closeSoundPanel.addEventListener("click", () => {
    soundPanel.classList.remove("open");
    soundOrb.setAttribute("aria-expanded", "false");
});

musicToggle.addEventListener("click", async () => {
    musicOn = !musicOn;

    if (musicOn) {
        try {
            await bgMusic.play();
            musicToggle.textContent = "ON";
            soundOrb.classList.add("playing");
        } catch {
            musicOn = false;
            alert("Music could not be played.");
        }
    } else {
        bgMusic.pause();
        musicToggle.textContent = "OFF";
        soundOrb.classList.remove("playing");
    }

    musicToggle.setAttribute("aria-pressed", String(musicOn));
});

volumeSlider.addEventListener("input", () => {
    const volume = Number(volumeSlider.value);

    bgMusic.volume = volume / 100;
    volumeValue.textContent = volume + "%";
});

muteButton.addEventListener("click", () => {
    muted = !muted;

    bgMusic.muted = muted;
    muteButton.textContent = muted ? "UNMUTE" : "MUTE";

    muteButton.setAttribute("aria-pressed", String(muted));
});

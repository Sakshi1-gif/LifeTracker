
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// =====================================================
// DEFAULT GAME DATA
// =====================================================

const defaultPlayer = {
    name: "Shadow Walker",
    level: 1,
    xp: 0,
    nextLevelXP: 400
};

const defaultStats = {
    health: 78,
    fitness: 65,
    focus: 72,
    finances: 420
};

const defaultQuests = [
    {
        id: 1,
        title: "Complete a workout",
        category: "Daily",
        type: "Compulsory",
        target: 1,
        progress: 0,
        reward: 30,
        stat: "fitness",
        completed: false
    },
    {
        id: 2,
        title: "Study for 2 hours",
        category: "Daily",
        type: "Compulsory",
        target: 2,
        progress: 0,
        reward: 40,
        stat: "focus",
        completed: false
    },
    {
        id: 3,
        title: "Read 10 pages",
        category: "Daily",
        type: "Optional",
        target: 10,
        progress: 0,
        reward: 20,
        stat: "focus",
        completed: false
    }
];

function copyDefaults() {
    return JSON.parse(JSON.stringify(defaultQuests));
}

let player = { ...defaultPlayer };
let stats = { ...defaultStats };
let quests = copyDefaults();
let events = [];
let currentUser = null;
let dataLoaded = false;


// =====================================================
// FIRESTORE SAVE / LOAD
// =====================================================

function getGameData() {
    return {
        player,
        stats,
        quests,
        events,
        updatedAt: new Date().toISOString()
    };
}

async function saveGameData() {
    if (!currentUser || !dataLoaded) {
        return false;
    }

    try {
        await setDoc(
            doc(db, "users", currentUser.uid),
            {
                name: player.name,
                email: currentUser.email,
                gameData: getGameData()
            },
            { merge: true }
        );

        return true;

    } catch (error) {
        console.error("Game data save failed:", error);
        return false;
    }
}


async function loadGameData() {
    const reference = doc(db, "users", currentUser.uid);
    const snapshot = await getDoc(reference);

    // Start with defaults before applying saved information.
    player = { ...defaultPlayer };
    stats = { ...defaultStats };
    quests = copyDefaults();
    events = [];

    if (!snapshot.exists()) {
        player.name = currentUser.displayName || "Shadow Walker";

        // Do not write default progress automatically.
        // The first real save will create the gameData field.
        return;
    }

    const data = snapshot.data();

    if (data.gameData) {
        const saved = data.gameData;

        player = {
            ...defaultPlayer,
            ...(saved.player || {})
        };

        stats = {
            ...defaultStats,
            ...(saved.stats || {})
        };

        if (Array.isArray(saved.quests)) {
            quests = saved.quests;
        }

        if (Array.isArray(saved.events)) {
            events = saved.events;
        }

    } else {
        // Preserve a saved character name if one exists.
        player.name =
            data.name ||
            currentUser.displayName ||
            "Shadow Walker";
    }

    // Prevent invalid or missing values from breaking the dashboard.
    if (!player.name) {
        player.name = currentUser.displayName || "Shadow Walker";
    }

    if (!Number.isFinite(Number(player.level))) {
        player.level = 1;
    }

    if (!Number.isFinite(Number(player.xp))) {
        player.xp = 0;
    }

    if (!Number.isFinite(Number(player.nextLevelXP)) ||
        Number(player.nextLevelXP) <= 0) {
        player.nextLevelXP = 400;
    }
}


// =====================================================
// AUTHENTICATION
// =====================================================

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    currentUser = user;
    dataLoaded = false;

    try {
        await loadGameData();

        dataLoaded = true;

        document.getElementById("playerNameInput").value =
            player.name;

        document.getElementById("accountEmail").textContent =
            user.email || "No email available";

        renderEverything();

    } catch (error) {
        console.error("Dashboard loading error:", error);

        alert(
            "Unable to load your game data. Please check your internet connection and Firebase settings."
        );
    }
});


// =====================================================
// NAVIGATION
// =====================================================

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

function showPage(pageName) {
    pages.forEach(page => {
        page.classList.toggle(
            "active",
            page.id === pageName
        );
    });

    navButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageName
        );
    });
}

document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});


// =====================================================
// CLOCK
// =====================================================

function updateClock() {
    const now = new Date();

    document.getElementById("currentDate").textContent =
        now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    document.getElementById("currentTime").textContent =
        now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
}

updateClock();
setInterval(updateClock, 1000);


// =====================================================
// RENDER EVERYTHING
// =====================================================

function renderEverything() {
    renderPlayer();
    renderStats();
    renderQuests();
    renderEvents();
}


// =====================================================
// PLAYER INFORMATION
// =====================================================

function renderPlayer() {
    document.getElementById("playerName").textContent =
        player.name;

    document.getElementById("welcomeName").textContent =
        player.name;

    document.getElementById("playerLevel").textContent =
        player.level;

    document.getElementById("overviewLevel").textContent =
        player.level;

    document.getElementById("overviewXP").textContent =
        player.xp;

    document.getElementById("xpText").textContent =
        `${player.xp} / ${player.nextLevelXP} XP`;

    const percentage =
        Math.min(
            (player.xp / player.nextLevelXP) * 100,
            100
        );

    document.getElementById("xpFill").style.width =
        percentage + "%";

    document.getElementById("overviewCompleted").textContent =
        quests.filter(quest => quest.completed).length;
}


// =====================================================
// CHARACTER STATS
// =====================================================

function renderStats() {
    const statElements = {
        health: {
            value: "healthValue",
            bar: "healthBar",
            max: 100
        },

        fitness: {
            value: "fitnessValue",
            bar: "fitnessBar",
            max: 100
        },

        focus: {
            value: "focusValue",
            bar: "focusBar",
            max: 100
        },

        finances: {
            value: "financeValue",
            bar: "financeBar",
            max: 1000
        }
    };

    Object.entries(statElements).forEach(([stat, elements]) => {
        const value = Number(stats[stat]) || 0;

        document.getElementById(elements.value).textContent =
            value;

        const percentage =
            Math.min(Math.max(value / elements.max * 100, 0), 100);

        document.getElementById(elements.bar).style.width =
            percentage + "%";
    });
}


// =====================================================
// QUEST DISPLAY
// =====================================================

function questHTML(quest) {
    const completed = quest.completed;

    return `
        <div class="quest-item">

            <div class="quest-details">

                <h3>${escapeHTML(quest.title)}</h3>

                <p>
                    ${Number(quest.progress) || 0}
                    /
                    ${Number(quest.target) || 1}
                    completed
                </p>

                <small>
                    ${escapeHTML(quest.category || "Quest")}
                    ·
                    ${escapeHTML(quest.type || "Optional")}
                    ·
                    Reward: ${Number(quest.reward) || 0} XP
                </small>

            </div>

            <div class="quest-actions">

                ${
                    completed
                    ? `<span class="quest-completed">✓ Completed</span>`
                    : `
                        <button
                            class="gold-button"
                            data-complete="${escapeHTML(quest.id)}"
                        >
                            Complete
                        </button>
                    `
                }

            </div>

        </div>
    `;
}


function renderQuests() {
    const activeQuests =
        quests.filter(quest => !quest.completed);

    const activeHTML =
        activeQuests
            .slice(0, 4)
            .map(questHTML)
            .join("");

    document.getElementById("activeQuestList").innerHTML =
        activeHTML ||
        `<p class="empty-message">No active quests. Enjoy your rest!</p>`;

    const allQuestHTML =
        quests.map(questHTML).join("");

    document.getElementById("questPageList").innerHTML =
        allQuestHTML ||
        `<p class="empty-message">No quests available.</p>`;

    // Update completed quest count.
    document.getElementById("overviewCompleted").textContent =
        quests.filter(quest => quest.completed).length;
}


// =====================================================
// COMPLETE QUEST
// =====================================================

async function completeQuest(id) {
    const quest = quests.find(
        item => String(item.id) === String(id)
    );

    if (!quest || quest.completed) {
        return;
    }

    quest.progress = quest.target;
    quest.completed = true;

    const reward = Number(quest.reward) || 0;

    player.xp += reward;

    // Increase the related stat.
    if (stats[quest.stat] !== undefined) {
        const maximum =
            quest.stat === "finances" ? 1000 : 100;

        stats[quest.stat] = Math.min(
            Number(stats[quest.stat]) + 5,
            maximum
        );
    }

    events.unshift({
        text: `Completed quest: ${quest.title}`,
        date: new Date().toLocaleString("en-IN")
    });

    // Level-up system.
    while (player.xp >= player.nextLevelXP) {
        player.xp -= player.nextLevelXP;
        player.level += 1;
        player.nextLevelXP += 100;
    }

    renderEverything();

    const saved = await saveGameData();

    if (!saved) {
        alert(
            "Quest completed on this page, but saving failed. Please check your connection and try Sync Game Data."
        );
    }
}


// Use event delegation so quest buttons keep working after rendering.
document.getElementById("questPageList").addEventListener("click", event => {
    const button = event.target.closest("[data-complete]");

    if (!button) return;

    completeQuest(button.dataset.complete);
});

document.getElementById("activeQuestList").addEventListener("click", event => {
    const button = event.target.closest("[data-complete]");

    if (!button) return;

    completeQuest(button.dataset.complete);
});


// =====================================================
// EVENTS
// =====================================================

function renderEvents() {
    function eventHTML(event) {
        return `
            <div class="event-item">

                <div class="event-icon">⚡</div>

                <div class="event-content">

                    <p>${escapeHTML(event.text || "Adventure event")}</p>

                    <small>${escapeHTML(event.date || "")}</small>

                </div>

            </div>
        `;
    }

    document.getElementById("recentEventList").innerHTML =
        events.slice(0, 4).map(eventHTML).join("") ||
        `<p class="empty-message">No recent events yet.</p>`;

    document.getElementById("eventPageList").innerHTML =
        events.map(eventHTML).join("") ||
        `<p class="empty-message">No events recorded yet.</p>`;
}


// =====================================================
// SETTINGS: SAVE CHARACTER NAME
// =====================================================

document.getElementById("saveNameBtn").addEventListener("click", async () => {
    const input =
        document.getElementById("playerNameInput");

    const name = input.value.trim();

    if (!name) {
        alert("Please enter a character name.");
        return;
    }

    player.name = name;

    renderPlayer();

    const saved = await saveGameData();

    if (saved) {
        alert("Character name saved successfully!");
    } else {
        alert("Could not save your character name. Please try again.");
    }
});


// =====================================================
// SETTINGS: PASSWORD VALIDATION
// =====================================================

function isValidPassword(password) {
    return (
        password.length > 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[@#$!%&*]/.test(password)
    );
}


// =====================================================
// SETTINGS: CHANGE PASSWORD
// =====================================================

document.getElementById("changePasswordBtn").addEventListener("click", async () => {
    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("changePasswordMessage");

    message.textContent = "";

    if (!currentPassword || !newPassword || !confirmPassword) {
        message.textContent = "Please fill in all password fields.";
        return;
    }

    if (!isValidPassword(newPassword)) {
        message.textContent = "Invalid password";
        return;
    }

    if (newPassword !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        return;
    }

    if (!currentUser || !currentUser.email) {
        message.textContent = "Please sign in again.";
        return;
    }

    try {
        const credential = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
        );

        await reauthenticateWithCredential(
            currentUser,
            credential
        );

        await updatePassword(
            currentUser,
            newPassword
        );

        message.textContent =
            "Password changed successfully.";

        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";

    } catch (error) {
        console.error("Password change error:", error);

        message.textContent =
            "Could not change password. Check your current password.";
    }
});


// =====================================================
// SETTINGS: SYNC DATA
// =====================================================

document.getElementById("syncDataBtn").addEventListener("click", async () => {
    const message =
        document.getElementById("syncMessage");

    message.textContent = "Syncing...";

    const saved = await saveGameData();

    if (saved) {
        message.textContent =
            "Progress synced successfully!";
    } else {
        message.textContent =
            "Sync failed. Please try again.";
    }
});


// =====================================================
// SETTINGS: RESET PROGRESS
// =====================================================

document.getElementById("resetProgressBtn").addEventListener("click", async () => {
    const confirmed = confirm(
        "Are you sure? Your level, XP, stats, quests and events will be reset."
    );

    if (!confirmed) return;

    const previousName = player.name;

    player = {
        ...defaultPlayer,
        name: previousName
    };

    stats = { ...defaultStats };
    quests = copyDefaults();
    events = [];

    renderEverything();

    const saved = await saveGameData();

    if (saved) {
        alert("Game progress has been reset.");
    } else {
        alert("Reset could not be saved. Please try syncing again.");
    }
});


// =====================================================
// LOGOUT
// =====================================================

async function logout() {
    const confirmed = confirm(
        "Are you sure you want to log out?"
    );

    if (!confirmed) return;

    try {
        await signOut(auth);
        window.location.href = "index.html";

    } catch (error) {
        console.error("Logout error:", error);
        alert("Unable to log out. Please try again.");
    }
}

document.getElementById("logoutBtn").addEventListener("click", logout);

document.getElementById("settingsLogoutBtn").addEventListener("click", logout);


// =====================================================
// SAFE HTML TEXT
// =====================================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[character]));
}


// =====================================================
// MUSIC CONTROL
// =====================================================

const bgMusic =
    document.getElementById("bgMusic");

const musicButton =
    document.getElementById("musicButton");

const musicPanel =
    document.getElementById("musicPanel");

const musicToggle =
    document.getElementById("musicToggle");

const volumeSlider =
    document.getElementById("volumeSlider");

const volumeValue =
    document.getElementById("volumeValue");

const closeMusicPanel =
    document.getElementById("closeMusicPanel");

let musicOn = false;

bgMusic.volume = 0.25;


// Open / close music panel.
musicButton.addEventListener("click", () => {
    musicPanel.classList.toggle("open");
});

closeMusicPanel.addEventListener("click", () => {
    musicPanel.classList.remove("open");
});


// Turn music on or off.
musicToggle.addEventListener("click", async () => {
    if (!musicOn) {
        try {
            await bgMusic.play();

            musicOn = true;
            musicToggle.textContent = "ON";
            musicButton.classList.add("playing");

        } catch (error) {
            console.error("Music playback error:", error);

            musicOn = false;
            musicToggle.textContent = "OFF";

            alert(
                "Music could not be played. Check that ambient.mp3 is in your project folder."
            );
        }

    } else {
        bgMusic.pause();

        musicOn = false;
        musicToggle.textContent = "OFF";
        musicButton.classList.remove("playing");
    }
});


// Volume slider.
volumeSlider.addEventListener("input", () => {
    const volume = Number(volumeSlider.value);

    bgMusic.volume = volume / 100;

    volumeValue.textContent =
        volume + "%";
});

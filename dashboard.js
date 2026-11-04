
// =====================================
// PLAYER DATA
// =====================================

let player = {
    name: "Shadow Walker",
    level: 5,
    xp: 220,
    nextLevelXP: 400
};


// =====================================
// QUEST DATA
// =====================================

let quests = [
    {
        id: 1,
        title: "Complete 20 minutes of exercise",
        category: "Compulsory · Daily",
        reward: 20,
        type: "fitness",
        completed: false
    },
    {
        id: 2,
        title: "Finish your study session",
        category: "Compulsory · Daily",
        reward: 15,
        type: "focus",
        completed: false
    },
    {
        id: 3,
        title: "Save $10",
        category: "Optional · Daily",
        reward: 10,
        type: "finances",
        completed: false
    }
];


// =====================================
// EVENT DATA
// =====================================

let events = [
    {
        title: "You found a hidden opportunity!",
        reward: "+50 Coins",
        time: "3 hours ago",
        icon: "◈"
    },
    {
        title: "You felt inspired while studying.",
        reward: "+15 Focus",
        time: "4 hours ago",
        icon: "⚡"
    },
    {
        title: "You missed your workout.",
        reward: "-5 XP",
        time: "6 hours ago",
        icon: "♥"
    }
];


// =====================================
// STATS
// =====================================

let stats = {
    health: 78,
    fitness: 65,
    focus: 72,
    finances: 420,
    time: 85
};


// =====================================
// PAGE NAVIGATION
// =====================================

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

function showPage(pageName) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageName + "Page");

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    const selectedButton = document.querySelector(
        `.nav-btn[data-page="${pageName}"]`
    );

    if (selectedButton) {
        selectedButton.classList.add("active");
    }

}

navButtons.forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });

});


// View All buttons

document.querySelectorAll(".view-all").forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });

});


// =====================================
// DATE AND TIME
// =====================================

function updateDateTime() {

    const now = new Date();

    const months = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];

    const day = String(now.getDate()).padStart(2, "0");

    const month = months[now.getMonth()];

    const year = now.getFullYear();

    let hours = now.getHours();
    let minutes = String(now.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    document.getElementById("dateText").textContent =
        `${month} ${day}, ${year}`;

    document.getElementById("timeText").textContent =
        `${hours}:${minutes} ${ampm}`;

}

updateDateTime();

setInterval(updateDateTime, 1000);


// =====================================
// PLAYER DISPLAY
// =====================================

function updatePlayer() {

    document.getElementById("playerName").textContent =
        player.name;

    document.getElementById("playerLevel").textContent =
        "Lv. " + player.level;

    document.getElementById("xpText").textContent =
        `${player.xp} / ${player.nextLevelXP} XP`;

    const percentage =
        (player.xp / player.nextLevelXP) * 100;

    document.getElementById("xpFill").style.width =
        percentage + "%";

    document.getElementById("progressLevel").textContent =
        player.level;

    document.getElementById("progressXP").textContent =
        player.xp + " XP earned";

    document.getElementById("progressXPFill").style.width =
        percentage + "%";

}


// =====================================
// UPDATE STATS
// =====================================

function updateStats() {

    document.getElementById("healthValue").textContent =
        stats.health;

    document.getElementById("fitnessValue").textContent =
        stats.fitness;

    document.getElementById("focusValue").textContent =
        stats.focus;

    document.getElementById("financesValue").textContent =
        stats.finances;

    document.getElementById("timeStatValue").textContent =
        stats.time;

}


// =====================================
// ADD RECENT EVENT
// =====================================

function addEvent(title, reward, icon = "✦") {

    events.unshift({
        title: title,
        reward: reward,
        time: "Just now",
        icon: icon
    });

    renderEvents();

}


// =====================================
// RENDER ACTIVE QUESTS
// =====================================

function renderActiveQuests() {

    const container =
        document.getElementById("activeQuestList");

    container.innerHTML = "";

    const activeQuests = quests.filter(
        quest => !quest.completed
    );

    if (activeQuests.length === 0) {

        container.innerHTML =
            `<p class="empty-message">
                No active quests. Enjoy your victory!
            </p>`;

        return;
    }

    activeQuests.forEach(quest => {

        const item = document.createElement("div");

        item.className = "quest-item";

        item.innerHTML = `
            <div class="quest-icon">⚔</div>

            <div class="quest-details">
                <h3>${quest.title}</h3>
                <p>${quest.category}</p>
            </div>

            <span class="quest-reward">+${quest.reward} XP</span>

            <button class="complete-quest"
                    data-id="${quest.id}">
                ✓
            </button>
        `;

        container.appendChild(item);

    });

}


// =====================================
// RENDER EVENTS
// =====================================

function renderEvents() {

    const recentContainer =
        document.getElementById("recentEventList");

    const allContainer =
        document.getElementById("allEventsList");

    recentContainer.innerHTML = "";
    allContainer.innerHTML = "";

    events.forEach((event, index) => {

        const item = document.createElement("div");

        item.className = "event-item";

        item.innerHTML = `
            <div class="event-icon">${event.icon}</div>

            <div class="event-details">
                <h3>${event.title}</h3>
                <p>${event.reward}</p>
            </div>

            <span class="quest-reward">${event.time}</span>
        `;

        allContainer.appendChild(item);

        if (index < 3) {
            recentContainer.appendChild(item.cloneNode(true));
        }

    });

}


// =====================================
// COMPLETE QUEST
// =====================================

function completeQuest(questId) {

    const quest = quests.find(
        quest => quest.id === questId
    );

    if (!quest || quest.completed) {
        return;
    }

    // Mark quest completed

    quest.completed = true;

    // Give XP reward

    player.xp += quest.reward;

    // Level up if necessary

    while (player.xp >= player.nextLevelXP) {

        player.xp -= player.nextLevelXP;

        player.level++;

        player.nextLevelXP += 100;

        addEvent(
            "You reached Level " + player.level + "!",
            "Level Up",
            "✦"
        );

    }

    // Increase related stat

    if (quest.type === "fitness") {
        stats.fitness = Math.min(100, stats.fitness + 5);
    }

    if (quest.type === "focus") {
        stats.focus = Math.min(100, stats.focus + 5);
    }

    if (quest.type === "finances") {
        stats.finances += 10;
    }

    // Add completion event

    addEvent(
        "Completed: " + quest.title,
        "+" + quest.reward + " XP",
        "✓"
    );

    // Update all displays

    renderActiveQuests();
    renderQuestPage();
    renderEvents();
    updatePlayer();
    updateStats();

    updateCompletedCount();

}


// =====================================
// QUEST COMPLETION BUTTONS
// =====================================

document.addEventListener("click", event => {

    const button = event.target.closest(".complete-quest");

    if (!button) {
        return;
    }

    const questId = Number(button.dataset.id);

    completeQuest(questId);

});


// =====================================
// QUEST JOURNAL
// =====================================

const questTabs = document.querySelectorAll(".quest-tab");

let currentQuestTab = "active";

questTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        questTabs.forEach(button => {
            button.classList.remove("active");
        });

        tab.classList.add("active");

        currentQuestTab = tab.dataset.tab;

        renderQuestPage();

    });

});


function renderQuestPage() {

    const container =
        document.getElementById("questPageList");

    container.innerHTML = "";

    const filteredQuests = quests.filter(quest => {

        if (currentQuestTab === "active") {
            return !quest.completed;
        }

        return quest.completed;

    });

    if (filteredQuests.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                Nothing here yet.
            </p>
        `;

        return;
    }

    filteredQuests.forEach(quest => {

        const item = document.createElement("div");

        item.className = "quest-item";

        item.innerHTML = `
            <div class="quest-icon">
                ${quest.completed ? "✓" : "⚔"}
            </div>

            <div class="quest-details">
                <h3>${quest.title}</h3>
                <p>${quest.category}</p>
            </div>

            <span class="quest-reward">
                ${quest.completed ? "Completed" : "+" + quest.reward + " XP"}
            </span>

            ${quest.completed ? "" : `
                <button class="complete-quest"
                        data-id="${quest.id}">
                    ✓
                </button>
            `}
        `;

        container.appendChild(item);

    });

}


// =====================================
// COMPLETED QUEST COUNT
// =====================================

function updateCompletedCount() {

    const count = quests.filter(
        quest => quest.completed
    ).length;

    document.getElementById("completedCount").textContent =
        count + " quests completed";

}


// =====================================
// PLAYER NAME SETTINGS
// =====================================

const playerNameInput =
    document.getElementById("playerNameInput");

document.getElementById("saveNameBtn")
    .addEventListener("click", () => {

        const newName = playerNameInput.value.trim();

        if (newName.length === 0) {
            alert("Please enter a player name.");
            return;
        }

        player.name = newName;

        updatePlayer();

        alert("Player name updated!");

    });


// =====================================
// LOG OUT
// =====================================

document.getElementById("logoutBtn")
    .addEventListener("click", () => {

        const confirmLogout = confirm(
            "Are you sure you want to log out?"
        );

        if (confirmLogout) {
            window.location.href = "index.html";
        }

    });


// =====================================
// MUSIC SYSTEM
// =====================================

const music = document.getElementById("bgMusic");

const musicButton = document.getElementById("musicButton");

const musicPanel = document.getElementById("musicPanel");

const musicToggle = document.getElementById("musicToggle");

const volumeSlider = document.getElementById("volumeSlider");

const volumeValue = document.getElementById("volumeValue");

const closeMusicPanel =
    document.getElementById("closeMusicPanel");

let musicEnabled = false;

music.volume = 0.25;


// Open / close panel

musicButton.addEventListener("click", () => {

    musicPanel.classList.toggle("open");

});

closeMusicPanel.addEventListener("click", () => {

    musicPanel.classList.remove("open");

});


// Music on/off

musicToggle.addEventListener("click", async () => {

    if (!musicEnabled) {

        try {

            await music.play();

            musicEnabled = true;

            musicButton.classList.add("playing");

            musicToggle.classList.add("on");

            musicToggle.textContent = "ON";

            musicButton.setAttribute("aria-pressed", "true");

            musicButton.setAttribute("aria-label", "Turn music off");

        } catch (error) {

            alert("Music could not play. Check ambient.mp3.");

            console.error(error);

        }

    } else {

        music.pause();

        musicEnabled = false;

        musicButton.classList.remove("playing");

        musicToggle.classList.remove("on");

        musicToggle.textContent = "OFF";

        musicButton.setAttribute("aria-pressed", "false");

        musicButton.setAttribute("aria-label", "Turn music on");

    }

});


// Volume

volumeSlider.addEventListener("input", () => {

    const volume = Number(volumeSlider.value);

    music.volume = volume / 100;

    volumeValue.textContent = volume + "%";

});


// Close music panel outside click

document.addEventListener("click", event => {

    if (!event.target.closest(".music-control")) {
        musicPanel.classList.remove("open");
    }

});


// Escape closes panel

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        musicPanel.classList.remove("open");
    }

});


// =====================================
// INITIALIZE DASHBOARD
// =====================================

renderActiveQuests();
renderQuestPage();
renderEvents();

updatePlayer();
updateStats();
updateCompletedCount();

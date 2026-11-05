
"use strict";

/* PLAYER */

let player = {
    name: "Shadow Walker",
    level: 5,
    xp: 220,
    nextLevelXP: 400
};

/* QUEST DATA */

let quests = [
    {
        id: 1,
        title: "Complete 20 minutes of exercise",
        category: "daily",
        type: "compulsory",
        reward: 10,
        progress: 12,
        target: 20,
        due: "Due today",
        completed: false,
        stat: "fitness"
    },
    {
        id: 2,
        title: "Finish your study session",
        category: "daily",
        type: "compulsory",
        reward: 15,
        progress: 1,
        target: 1,
        due: "Completed",
        completed: true,
        stat: "focus"
    },
    {
        id: 3,
        title: "Save $10",
        category: "daily",
        type: "optional",
        reward: 10,
        progress: 5,
        target: 10,
        due: "Due today",
        completed: false,
        stat: "finances"
    },
    {
        id: 4,
        title: "Read a book for 30 minutes",
        category: "daily",
        type: "optional",
        reward: 10,
        progress: 0,
        target: 1,
        due: "Due in 2 days",
        completed: false,
        stat: "focus"
    },
    {
        id: 5,
        title: "Work on your long-term goal",
        category: "weekly",
        type: "compulsory",
        reward: 30,
        progress: 1,
        target: 3,
        due: "Due in 4 days",
        completed: false,
        stat: "focus"
    }
];

/* EVENTS */

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

/* STATS */

let stats = {
    health: 78,
    fitness: 65,
    focus: 72,
    finances: 420,
    time: 85
};

let filter = "all";

/* SHORTCUTS */

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

/* NAVIGATION */

function showPage(name) {

    $$(".page").forEach(page => {
        page.classList.remove("active");
    });

    $$(".nav-btn").forEach(button => {
        button.classList.remove("active");
    });

    $("#" + name + "Page")?.classList.add("active");

    document
        .querySelector(`.nav-btn[data-page="${name}"]`)
        ?.classList.add("active");
}

$$(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

$$(".view-all").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

/* DATE AND TIME */

function clock() {

    let d = new Date();

    $("#dateText").textContent =
        d.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        });

    $("#timeText").textContent =
        d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit"
        });
}

clock();
setInterval(clock, 1000);

/* PLAYER XP */

function updatePlayer() {

    $("#playerName").textContent = player.name;

    $("#playerLevel").textContent =
        "Lv. " + player.level;

    $("#xpText").textContent =
        `${player.xp} / ${player.nextLevelXP} XP`;

    let percentage =
        Math.min(100, player.xp / player.nextLevelXP * 100);

    $("#xpFill").style.width = percentage + "%";

    $("#progressLevel").textContent = player.level;

    $("#progressXP").textContent =
        player.xp + " XP earned";

    $("#progressXPFill").style.width =
        percentage + "%";
}

/* UPDATE STATS */

function updateStats() {

    Object.entries(stats).forEach(([key, value]) => {

        $("#" + key + "Value").textContent = value;

        let maxValue = key === "finances" ? 1000 : 100;

        $("#" + key + "Bar").style.width =
            Math.min(100, value / maxValue * 100) + "%";

    });
}

/* PREVENT HTML INJECTION */

function safe(text) {

    return String(text).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[character]));
}

/* EVENT RENDERING */

function renderEvents() {

    let container = $("#allEventsList");

    container.innerHTML = "";

    events.forEach(event => {

        let div = document.createElement("div");

        div.className = "event-item";

        div.innerHTML = `
            <div class="event-icon">${event.icon}</div>

            <div class="event-details">
                <h3>${safe(event.title)}</h3>
                <p>${safe(event.reward)}</p>
            </div>

            <span class="quest-reward">
                ${event.time}
            </span>
        `;

        container.append(div);
    });
}

/* ADD EVENT */

function addEvent(title, reward, icon = "✦") {

    events.unshift({
        title: title,
        reward: reward,
        time: "Just now",
        icon: icon
    });

    renderEvents();
}

/* QUEST BOARD */

function renderQuests() {

    let container = $("#questList");

    container.innerHTML = "";

    let list = quests;

    if (filter === "daily" || filter === "weekly") {

        list = quests.filter(quest =>
            quest.category === filter
        );

    }

    if (filter === "compulsory" || filter === "optional") {

        list = quests.filter(quest =>
            quest.type === filter
        );

    }

    if (list.length === 0) {

        container.innerHTML = `
            <div class="empty-quests">
                No quests found in this category.
            </div>
        `;

        return;
    }

    list.forEach(quest => {

        let percentage =
            Math.min(100, quest.progress / quest.target * 100);

        let div = document.createElement("div");

        div.className =
            "quest-card" + (quest.completed ? " completed" : "");

        div.innerHTML = `
            <div class="quest-card-icon">
                ${quest.completed ? "✓" : "⚔"}
            </div>

            <div class="quest-card-main">

                <h3 class="quest-card-title">
                    ${safe(quest.title)}
                </h3>

                <div class="quest-card-meta">
                    <span>${quest.category}</span>
                    ·
                    <span>${quest.type}</span>
                    ·
                    <span class="quest-progress-text">
                        ${quest.progress}/${quest.target}
                    </span>
                </div>

                <div class="quest-progress-track">
                    <div
                        class="quest-progress-fill"
                        style="width:${percentage}%">
                    </div>
                </div>

            </div>

            <div class="quest-card-right">

                <span class="quest-xp">
                    +${quest.reward} XP
                </span>

                <span class="quest-status ${quest.completed ? "done" : "due"}">
                    ${quest.completed ? "Completed" : quest.due}
                </span>

                <button
                    class="quest-action"
                    data-id="${quest.id}"
                    ${quest.completed ? "disabled" : ""}>
                    ${quest.completed ? "✓ Done" : "Complete"}
                </button>

            </div>
        `;

        container.append(div);
    });
}

/* DASHBOARD QUEST PREVIEW */

function renderDashboard() {

    let container = $("#dashboardQuestList");

    container.innerHTML = "";

    let list = quests
        .filter(quest => !quest.completed)
        .slice(0, 3);

    if (list.length === 0) {

        container.innerHTML = `
            <p class="empty-quests">
                All quests completed. Enjoy your victory!
            </p>
        `;

        return;
    }

    list.forEach(quest => {

        let div = document.createElement("div");

        div.className = "quest-item";

        div.innerHTML = `
            <div class="quest-icon">⚔</div>

            <div class="quest-details">
                <h3>${safe(quest.title)}</h3>
                <p>${quest.progress}/${quest.target} completed</p>
            </div>

            <span class="quest-reward">
                +${quest.reward} XP
            </span>
        `;

        container.append(div);
    });
}

/* COMPLETED QUEST COUNT */

function countDone() {

    $("#completedCount").textContent =
        quests.filter(quest => quest.completed).length
        + " quests completed";
}

/* QUEST FILTERS */

$$(".quest-filter").forEach(button => {

    button.addEventListener("click", () => {

        $$(".quest-filter").forEach(filterButton => {
            filterButton.classList.remove("active");
        });

        button.classList.add("active");

        filter = button.dataset.filter;

        renderQuests();
    });
});

/* COMPLETE QUEST */

document.addEventListener("click", event => {

    let button = event.target.closest(".quest-action");

    if (!button || button.disabled) return;

    let quest = quests.find(item =>
        item.id === Number(button.dataset.id)
    );

    if (!quest || quest.completed) return;

    quest.progress = quest.target;
    quest.completed = true;
    quest.due = "Completed";

    player.xp += quest.reward;

    /* LEVEL UP */

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

    /* STAT REWARDS */

    if (quest.stat === "fitness") {
        stats.fitness = Math.min(100, stats.fitness + 5);
    }

    if (quest.stat === "focus") {
        stats.focus = Math.min(100, stats.focus + 5);
    }

    if (quest.stat === "finances") {
        stats.finances += 10;
    }

    addEvent(
        "Completed: " + quest.title,
        "+" + quest.reward + " XP",
        "✓"
    );

    renderQuests();
    renderDashboard();
    renderEvents();

    updatePlayer();
    updateStats();
    countDone();
});

/* ADD QUEST MODAL */

const modal = $("#questModal");

$("#addQuestBtn").addEventListener("click", () => {
    modal.classList.add("open");
});

$("#closeQuestModal").addEventListener("click", () => {
    modal.classList.remove("open");
});

modal.addEventListener("click", event => {

    if (event.target === modal) {
        modal.classList.remove("open");
    }
});

/* ESCAPE KEY */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        modal.classList.remove("open");

        $("#musicPanel").classList.remove("open");
    }
});

/* CREATE QUEST */

$("#questForm").addEventListener("submit", event => {

    event.preventDefault();

    let title = $("#newQuestTitle").value.trim();

    let target = Number($("#newQuestTarget").value);

    let reward = Number($("#newQuestXP").value);

    if (!title || target < 1 || reward < 1) {

        alert("Please enter valid quest details.");

        return;
    }

    quests.push({

        id: Date.now(),

        title: title,

        category: $("#newQuestCategory").value,

        type: $("#newQuestType").value,

        reward: reward,

        progress: 0,

        target: target,

        due: $("#newQuestDue").value,

        completed: false,

        stat: "focus"

    });

    event.target.reset();

    $("#newQuestTarget").value = 1;
    $("#newQuestXP").value = 10;

    modal.classList.remove("open");

    renderQuests();
    renderDashboard();
    countDone();
});

/* SETTINGS */

$("#saveNameBtn").addEventListener("click", () => {

    let name = $("#playerNameInput").value.trim();

    if (!name) {

        alert("Please enter a player name.");

        return;
    }

    player.name = name;

    updatePlayer();

    alert("Player name updated!");
});

/* LOGOUT */

$("#logoutBtn").addEventListener("click", () => {

    if (confirm("Are you sure you want to log out?")) {

        location.href = "index.html";
    }
});

/* MUSIC */

const music = $("#bgMusic");

let playing = false;

music.volume = 0.25;

$("#musicButton").addEventListener("click", () => {

    $("#musicPanel").classList.toggle("open");
});

$("#closeMusicPanel").addEventListener("click", () => {

    $("#musicPanel").classList.remove("open");
});

/* MUSIC ON/OFF */

$("#musicToggle").addEventListener("click", async () => {

    if (!playing) {

        try {

            await music.play();

            playing = true;

            $("#musicButton").classList.add("playing");

            $("#musicToggle").textContent = "ON";

        } catch (error) {

            alert("Music could not play. Check ambient.mp3.");
        }

    } else {

        music.pause();

        playing = false;

        $("#musicButton").classList.remove("playing");

        $("#musicToggle").textContent = "OFF";
    }
});

/* MUSIC VOLUME */

$("#volumeSlider").addEventListener("input", event => {

    music.volume = Number(event.target.value) / 100;

    $("#volumeValue").textContent =
        event.target.value + "%";
});

/* CLOSE MUSIC PANEL OUTSIDE */

document.addEventListener("click", event => {

    if (!event.target.closest(".music-control")) {

        $("#musicPanel").classList.remove("open");
    }
});

/* INITIAL RENDER */

renderQuests();
renderDashboard();
renderEvents();

updatePlayer();
updateStats();
countDone();

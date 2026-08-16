(() => {
    let audio = null;
    let container = null;

    const speeds = [0.75, 1, 1.25, 1.5, 1.75, 2];

    function findAudio() {
        const audios = [...document.querySelectorAll("audio")];

        if (!audios.length) return null;

        return audios.find(a => !a.paused) || audios[0];
    }

    function createSpeedControl() {
        if (container) return;

        container = document.createElement("div");
        container.id = "gemini-speed-control";

        container.innerHTML = `
            <button
                id="gemini-speed-button"
                aria-label="Playback speed"
                title="Playback speed"
            >
                <span class="speed-icon">1×</span>
            </button>

            <div id="gemini-speed-menu">
                ${speeds.map(speed => `
                    <button
                        class="speed-option ${speed === 1 ? "selected" : ""}"
                        data-speed="${speed}"
                    >
                        ${speed}×
                    </button>
                `).join("")}
            </div>
        `;

        document.body.appendChild(container);

        const speedButton =
            document.getElementById("gemini-speed-button");

        const menu =
            document.getElementById("gemini-speed-menu");

        speedButton.addEventListener("click", (event) => {
            event.stopPropagation();

            menu.classList.toggle("show");
        });

        document.querySelectorAll(".speed-option").forEach(option => {
            option.addEventListener("click", () => {
                const speed = Number(option.dataset.speed);

                audio = findAudio();

                if (audio) {
                    audio.playbackRate = speed;
                }

                document.querySelectorAll(".speed-option")
                    .forEach(item => item.classList.remove("selected"));

                option.classList.add("selected");

                speedButton.querySelector(".speed-icon").textContent =
                    `${speed}×`;

                menu.classList.remove("show");
            });
        });

        document.addEventListener("click", (event) => {
            if (!container.contains(event.target)) {
                menu.classList.remove("show");
            }
        });
    }

    function checkForAudio() {
        const currentAudio = findAudio();

        if (currentAudio && currentAudio !== audio) {
            audio = currentAudio;

            createSpeedControl();

            // Remember current selected speed
            const selected =
                document.querySelector(".speed-option.selected");

            if (selected) {
                audio.playbackRate =
                    Number(selected.dataset.speed);
            }
        }
    }

    setInterval(checkForAudio, 500);
})();

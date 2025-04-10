// ==UserScript==
// @name         Diep.io Coffee Stat Builder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @homepage     https://github.com/YourGithubRepo/DiepioCoffeeUITheme
// @description  A coffee-themed UI for Diep.io custom stat builds. Enjoy a latte-inspired makeover with professional texts and intuitive design.
// @author       -{Abyss⌬}-ora (Modified by Ceiko)
// @match        https://diep.io/*
// @grant        none
// @license      MIT
// @downloadURL  
// @updateURL    
// ==/UserScript==

(function () {
    "use strict";

    /* ============================================================
     * Utility functions to manage version update and data backup.
     * ============================================================ */
    function getScriptVersion() {
        const metadataBlock = `
        // ==UserScript==
        // @name         Diep.io Coffee UI Theme – Final UI Overhaul
        // @namespace    http://tampermonkey.net/
        // @version      1.0
        // @homepage     https://github.com/YourGithubRepo/DiepioCoffeeUITheme
        // @description  A coffee-themed UI for Diep.io custom stat builds. Enjoy a latte-inspired makeover with professional texts and intuitive design.
        // @author       -{Abyss⌬}-ora (Modified by CoffeeMaker)
        // @match        https://diep.io/*
        // @grant        none
        // @license      MIT
        // @downloadURL  https://yourdomain.com/DiepioCoffeeUITheme.user.js
        // @updateURL    https://yourdomain.com/DiepioCoffeeUITheme.meta.js
        // ==/UserScript==`;

        const versionMatch = metadataBlock.match(/@version\s+([\d.]+)/);
        return versionMatch ? versionMatch[1] : null;
    }

    function saveDataBeforeUpdate() {
        const dataToSave = {
            quickSpawnUsername: localStorage.getItem("quickSpawnUsername"),
            savedNames: localStorage.getItem("savedNames"),
            savedButtons: localStorage.getItem("savedButtons"),
            removedDefaults: localStorage.getItem("removedDefaults")
        };
        localStorage.setItem("backupData", JSON.stringify(dataToSave));
    }

    function retrieveDataAfterUpdate() {
        const backupData = JSON.parse(localStorage.getItem("backupData"));
        if (backupData) {
            localStorage.setItem("quickSpawnUsername", backupData.quickSpawnUsername);
            localStorage.setItem("savedNames", backupData.savedNames);
            localStorage.setItem("savedButtons", backupData.savedButtons);
            localStorage.setItem("removedDefaults", backupData.removedDefaults);
        }
    }

    function checkAndUpdateVersion() {
        const currentVersion = getScriptVersion();
        const savedVersion = localStorage.getItem("scriptVersion");

        if (!savedVersion || savedVersion < currentVersion) {
            retrieveDataAfterUpdate();
            localStorage.setItem("scriptVersion", currentVersion);
        }
    }

    // Backup current data before update.
    saveDataBeforeUpdate();
    checkAndUpdateVersion();

    /* ============================================================
     * Create the main hover menu container.
     * ============================================================ */
    const hoverMenu = document.createElement("div");
    hoverMenu.id = "myhover";
    hoverMenu.className = "hover";

    // Main mod menu container.
    const modMenu = document.createElement("a");
    modMenu.id = "modtab";

    // Build header with version and title.
    const menuHeader = document.createElement("h1");
    const versionText = document.createElement("small");
    const smallerVersionText = document.createElement("small");
    smallerVersionText.textContent = `Version: ${getScriptVersion()}`;
    versionText.appendChild(smallerVersionText);
    menuHeader.appendChild(versionText);
    menuHeader.appendChild(document.createElement("br"));
    menuHeader.appendChild(document.createTextNode("-[Ceiko's]- Coffee Themed Stat Builder☕"));
    modMenu.appendChild(menuHeader);

    // Refresh button in top-right corner.
    const topRightButton = document.createElement("button");
    topRightButton.id = "topRightButton";
    topRightButton.textContent = "↻";

    /* ============================================================
     * CSS Styling - Coffee Themed
     * Primary colors:
     *  - Latte Cream: #d9c4a1
     *  - Coffee Milk: #b8926d
     *  - Espresso Brown: #5b4636
     *  - Light Foam: #f1e3d3
     * ============================================================ */
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = `
        /* Main hover menu styling */
        #myhover a {
            z-index: 999;
            position: absolute;
            top: 300px;
            right: -260px;
            transition: 0.3s;
            width: 250px;
            padding: 15px;
            background: linear-gradient(45deg, #d9c4a1, #b8926d);
            background-color: #b8926d;
            text-decoration: none;
            font-size: 12px;
            font-family: 'Arial', sans-serif;
            text-shadow: 1px 1px #5b4636;
            color: #5b4636;
            border: 2px solid #5b4636;
            border-radius: 15px;
        }
        #myhover a:hover {
            right: 0;
        }
        /* Button styling */
        .button {
            display: block;
            margin: 5px auto;
            width: 90%;
            text-align: center;
            font-size: 16px;
            font-family: 'Arial', sans-serif;
            color: #5b4636;
            background-color: #f1e3d3;
            border-radius: 5px;
            transition: 0.4s;
            cursor: pointer;
            border: 1px solid #5b4636;
        }
        .button:hover {
            transform: translateX(-10px);
            background-color: #d9c4a1;
        }
        /* User input styling */
        #userInput {
            margin: 5px auto;
            width: 90%;
            padding: 10px;
            font-family: 'Arial', sans-serif;
            text-align: center;
            border: 2px solid #5b4636;
            border-radius: 5px;
            color: #5b4636;
        }
        /* Special button styling */
        #specialButton {
            display: block;
            margin: 5px auto;
            width: 90%;
            text-align: center;
            font-size: 16px;
            font-family: 'Arial', sans-serif;
            color: #f1e3d3;
            background-color: #5b4636;
            border-radius: 5px;
            border: 2px solid #5b4636;
            transition: 0.4s;
            cursor: pointer;
            opacity: 0.9;
        }
        #specialButton:hover {
            color: #5b4636;
            background-color: #b8926d;
            transform: translateX(-10px);
        }
        /* Popup styling */
        .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 320px;
            background: #f1e3d3;
            border: 2px solid #5b4636;
            border-radius: 10px;
            padding: 20px;
            z-index: 1000;
            text-shadow: 1px 1px #5b4636;
            font-family: 'Arial', sans-serif;
            color: #5b4636;
        }
        .popup-header {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 5px;
            left: 0;
            right: 35px;
            height: 30px;
            cursor: move;
            z-index: 10;
            background-color: rgba(91,70,54, 0.9);
            color: #f1e3d3;
            font-size: 12px;
            border: 1px solid #f1e3d3;
            border-radius: 10px;
        }
        /* Attribute row styling */
        .attribute {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .attribute div {
            width: 30px;
            height: 30px;
            margin: 0 2px;
        }
        .attribute button {
            background-color: #b8926d;
            border: none;
            color: #5b4636;
            font-size: 20px;
            cursor: pointer;
            width: 32px;
            height: 32px;
            margin: 0;
        }
        /* Points counter styling */
        #pointsCounter {
            text-align: center;
            font-size: 16px;
            margin-bottom: 10px;
        }
        /* Create build button styling */
        #createBuildButton {
            display: block;
            margin: 20px auto 0;
            width: 80%;
            text-align: center;
            font-size: 16px;
            font-family: 'Arial', sans-serif;
            color: #5b4636;
            background-color: #f1e3d3;
            border-radius: 5px;
            border: 2px solid #5b4636;
            cursor: pointer;
            padding: 10px;
        }
        #createBuildButton:hover {
            background-color: #b8926d;
            color: #f1e3d3;
        }
        /* Code string input styling */
        #codeString {
            text-align: center;
            font-size: 16px;
            margin: 10px 0;
            border: 2px solid #5b4636;
            border-radius: 5px;
            padding: 5px;
        }
        /* Remove and edit button styling */
        .remove-button, .edit-button {
            background-color: #b8926d;
            border: none;
            color: #f1e3d3;
            font-size: 18px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            margin-right: 5px;
            transition: background-color 0.3s;
            border-radius: 5px;
        }
        .remove-button:hover {
            background-color: #5b4636;
        }
        .edit-button:hover {
            background-color: #d9c4a1;
        }
        /* Close button styling */
        .close-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 5px;
            right: 5px;
            width: 35px;
            height: 35px;
            color: #f1e3d3;
            cursor: pointer;
            font-size: 18px;
            border-radius: 5px;
            background-color: rgba(91,70,54, 0.9);
            transition: background-color 0.3s;
        }
        .close-btn:hover {
            background-color: #5b4636;
        }
        /* Top right refresh button */
        #topRightButton {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            background-color: #5b4636;
            color: #f1e3d3;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.3s;
            z-index: 1001;
            opacity: 0.9;
        }
        #topRightButton:hover {
            background-color: #b8926d;
            color: #5b4636;
        }
        /* Build buttons container styling */
        #buildButtonsContainer {
            max-height: 400px;
            overflow-y: scroll;
            margin-left: 5px;
            padding-right: 5px;
        }
        /* Custom scrollbar */
        #buildButtonsContainer {
            -ms-overflow-style: none;
            scrollbar-width: thin;
        }
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1e3d3;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: #b8926d;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #5b4636;
        }
    `;
    document.head.appendChild(style);

    /* ============================================================
     * User Input Section for In-Game Username.
     * ============================================================ */
    const inputContainer = document.createElement("div");
    inputContainer.style.position = "relative";
    inputContainer.style.width = "90%";
    inputContainer.style.margin = "5px auto";

    // Icon indicating favorite or save build.
    const heartIcon = document.createElement("span");
    heartIcon.textContent = "♥";
    heartIcon.style.position = "absolute";
    heartIcon.style.left = "10px";
    heartIcon.style.top = "50%";
    heartIcon.style.transform = "translateY(-50%)";
    heartIcon.style.cursor = "pointer";
    heartIcon.style.fontSize = "18px";
    heartIcon.style.color = "black";

    // Improved input placeholder.
    const userInput = document.createElement("input");
    userInput.id = "userInput";
    userInput.type = "text";
    userInput.placeholder = "Your In-Game Username";
    userInput.value = localStorage.getItem("quickSpawnUsername") || "";
    userInput.style.width = "100%";
    userInput.style.padding = "10px 30px 10px 30px";
    userInput.style.border = "2px solid #5b4636";
    userInput.style.borderRadius = "5px";
    userInput.style.boxSizing = "border-box";
    userInput.style.fontFamily = "Arial, sans-serif";
    userInput.style.textAlign = "center";

    // Dropdown arrow for saved names.
    const dropdownArrow = document.createElement("span");
    dropdownArrow.textContent = "▼";
    dropdownArrow.style.position = "absolute";
    dropdownArrow.style.right = "10px";
    dropdownArrow.style.top = "50%";
    dropdownArrow.style.transform = "translateY(-50%)";
    dropdownArrow.style.cursor = "pointer";
    dropdownArrow.style.fontSize = "14px";
    dropdownArrow.style.color = "black";

    // Dropdown menu container.
    const dropdown = document.createElement("div");
    dropdown.id = "dropdownMenu";
    dropdown.style.position = "absolute";
    dropdown.style.width = "100%";
    dropdown.style.top = "100%";
    dropdown.style.left = "0";
    dropdown.style.background = "#d9c4a1";
    dropdown.style.border = "2px solid #5b4636";
    dropdown.style.borderTop = "none";
    dropdown.style.display = "none";
    dropdown.style.zIndex = "100";
    dropdown.style.maxHeight = "150px";
    dropdown.style.overflowY = "auto";

    // Toggle dropdown on arrow click.
    dropdownArrow.addEventListener("click", () => {
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });

    // Hide dropdown when clicking outside.
    document.addEventListener("click", (event) => {
        if (!inputContainer.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });

    userInput.addEventListener("input", (event) => {
        localStorage.setItem("quickSpawnUsername", event.target.value);
        updateHeartIcon();
    });

    heartIcon.addEventListener("click", () => {
        const name = userInput.value.trim();
        if (name) {
            const savedNames = JSON.parse(localStorage.getItem("savedNames")) || [];
            const nameIndex = savedNames.indexOf(name);
            if (nameIndex === -1) {
                savedNames.push(name);
                heartIcon.style.color = "red";
            } else {
                savedNames.splice(nameIndex, 1);
                heartIcon.style.color = "black";
            }
            localStorage.setItem("savedNames", JSON.stringify(savedNames));
            updateDropdown(savedNames);
        }
    });

    function updateDropdown(names) {
        dropdown.innerHTML = "";
        names.forEach(name => {
            const optionContainer = document.createElement("div");
            optionContainer.style.display = "flex";
            optionContainer.style.alignItems = "center";
            optionContainer.style.justifyContent = "space-between";
            optionContainer.style.padding = "8px";
            optionContainer.style.cursor = "pointer";
            optionContainer.style.fontFamily = "Arial, sans-serif";
            optionContainer.style.textAlign = "center";
            optionContainer.style.fontSize = "16px";
            optionContainer.style.background = "#d9c4a1";
            optionContainer.style.transition = "background 0.3s";

            const option = document.createElement("div");
            option.textContent = name;
            option.style.flexGrow = "1";
            option.style.textAlign = "left";

            option.addEventListener("mouseover", () => {
                optionContainer.style.backgroundColor = "#b8926d";
            });

            option.addEventListener("mouseout", () => {
                optionContainer.style.backgroundColor = "transparent";
            });

            option.addEventListener("click", () => {
                userInput.value = name;
                dropdown.style.display = "none";
                localStorage.setItem("quickSpawnUsername", name);
                updateHeartIcon();
            });

            optionContainer.appendChild(option);
            dropdown.appendChild(optionContainer);
        });
    }

    function updateHeartIcon() {
        const name = userInput.value.trim();
        const savedNames = JSON.parse(localStorage.getItem("savedNames")) || [];
        if (savedNames.includes(name)) {
            heartIcon.style.color = "red";
        } else {
            heartIcon.style.color = "black";
        }
    }

    const savedNames = JSON.parse(localStorage.getItem("savedNames")) || [];
    updateDropdown(savedNames);
    updateHeartIcon();

    inputContainer.appendChild(heartIcon);
    inputContainer.appendChild(userInput);
    inputContainer.appendChild(dropdownArrow);
    inputContainer.appendChild(dropdown);
    modMenu.appendChild(inputContainer);

    /* ============================================================
     * Build Buttons and Special Functions.
     * ============================================================ */
    const buildButtonsContainer = document.createElement("div");
    buildButtonsContainer.id = "buildButtonsContainer";
    buildButtonsContainer.style.maxHeight = "400px";
    buildButtonsContainer.style.overflowY = "scroll";
    buildButtonsContainer.style.color = "#5b4636";
    modMenu.appendChild(buildButtonsContainer);

    // Array for dynamic buttons. (Existing buttons will be loaded from localStorage)
    const buttons = [];

    // Create stat build button when a new build is saved.
    const specialButton = document.createElement("button");
    specialButton.id = "specialButton";
    specialButton.textContent = "[+]";
    specialButton.onclick = () => {
        // Create new popup for building a custom stat build.
        const popup = document.createElement("div");
        popup.className = "popup";
        popup.id = "resetPopup";
        popup.innerHTML = `<div class="popup-header" id="resetPopupHeader">Drag Window</div>`;
        document.body.appendChild(popup);

        const closeButton = document.createElement("button");
        closeButton.className = "close-btn";
        closeButton.textContent = "X";
        closeButton.onclick = () => {
            document.body.removeChild(popup);
        };
        popup.appendChild(closeButton);

        // Build Name Input Field.
        const buildNameInput = document.createElement("input");
        buildNameInput.type = "text";
        buildNameInput.placeholder = "Enter Build Name";
        buildNameInput.style.display = "block";
        buildNameInput.style.width = "80%";
        buildNameInput.style.margin = "0 auto 10px";
        popup.appendChild(buildNameInput);

        // Points Counter.
        const pointsCounter = document.createElement("div");
        pointsCounter.id = "pointsCounter";
        pointsCounter.textContent = "Points: 33";
        popup.appendChild(pointsCounter);

        // Code string to store stat build commands.
        const codeString = document.createElement("input");
        codeString.id = "codeString";
        codeString.type = "text";
        codeString.value = "";
        codeString.style.display = "block";
        codeString.style.width = "80%";
        codeString.style.margin = "10px auto";
        popup.appendChild(codeString);

        let totalPoints = 33;
        let code = "";

        // Attribute definitions with coffee-themed colors.
        const attributes = [
            { name: "Health Regen", color: "#d9c4a1" },
            { name: "Max Health", color: "#b8926d" },
            { name: "Body Damage", color: "#a67c52" },
            { name: "Bullet Speed", color: "#e3d4b9" },
            { name: "Bullet Penetration", color: "#c1a184" },
            { name: "Bullet Damage", color: "#a67c52" },
            { name: "Reload", color: "#d9c4a1" },
            { name: "Movement Speed", color: "#e3d4b9" }
        ];

        function updateAttributes() {
            totalPoints = 33;
            attributes.forEach((attribute, index) => {
                const attributeRow = document.getElementById(`attributeRow-${index}`);
                const attributeCount = Math.min((code.match(new RegExp(index + 1, "g")) || []).length, 7);
                for (let i = 0; i < 7; i++) {
                    const square = attributeRow.children[i + 1];
                    if (i < attributeCount) {
                        square.style.backgroundColor = attribute.color;
                        square.style.border = "1px solid #5b4636";
                        totalPoints--;
                    } else {
                        square.style.backgroundColor = "gray";
                        square.style.border = "0";
                    }
                }
            });
            pointsCounter.textContent = `Points: ${totalPoints}`;
        }

        // Create attribute rows with plus and minus buttons.
        attributes.forEach((attribute, index) => {
            const attributeRow = document.createElement("div");
            attributeRow.className = "attribute";
            attributeRow.id = `attributeRow-${index}`;
            attributeRow.style.position = "relative";

            const minusButton = document.createElement("button");
            minusButton.style.padding = "0 5px";
            minusButton.style.border = "1px solid #5b4636";
            minusButton.style.borderRadius = "15px 0 0 15px";
            minusButton.style.width = "32px";
            minusButton.style.height = "32px";
            minusButton.textContent = "-";
            minusButton.onclick = () => {
                const coloredSquares = Array.from(attributeRow.children)
                    .filter(child => child !== plusButton && child.style.backgroundColor === attribute.color);
                if (coloredSquares.length > 0) {
                    const square = coloredSquares[coloredSquares.length - 1];
                    square.style.backgroundColor = "gray";
                    square.style.border = "0";
                    totalPoints++;
                    pointsCounter.textContent = `Points: ${totalPoints}`;
                    code = code.slice(0, -1);
                    codeString.value = code;
                    updateAttributes();
                }
            };
            attributeRow.appendChild(minusButton);

            for (let i = 0; i < 7; i++) {
                const colorDiv = document.createElement("div");
                colorDiv.style.backgroundColor = "gray";
                colorDiv.style.width = "30px";
                colorDiv.style.height = "30px";
                colorDiv.style.display = "inline-block";
                colorDiv.style.margin = "0 3px";
                if (i === 3) {
                    const textSpan = document.createElement("span");
                    textSpan.textContent = attribute.name;
                    textSpan.style.position = "absolute";
                    textSpan.style.top = "50%";
                    textSpan.style.left = "50%";
                    textSpan.style.transform = "translate(-50%, -50%)";
                    textSpan.style.color = "#f1e3d3";
                    textSpan.style.pointerEvents = "none";
                    textSpan.style.fontSize = "10px";
                    textSpan.style.textShadow = "1px 1px 1px #5b4636";
                    colorDiv.appendChild(textSpan);
                }
                attributeRow.appendChild(colorDiv);
            }

            const plusButton = document.createElement("button");
            plusButton.style.padding = "0 5px";
            plusButton.style.border = "1px solid #5b4636";
            plusButton.style.borderRadius = "0 15px 15px 0";
            plusButton.style.width = "32px";
            plusButton.style.height = "32px";
            plusButton.style.fontWeight = "bold";
            plusButton.textContent = "+";
            plusButton.style.backgroundColor = attribute.color;
            plusButton.onclick = () => {
                const graySquares = Array.from(attributeRow.children)
                    .filter(child => child.style.backgroundColor === "gray" && child !== plusButton);
                if (graySquares.length > 0) {
                    const square = graySquares[0];
                    square.style.backgroundColor = attribute.color;
                    square.style.border = "1px solid #5b4636";
                    totalPoints--;
                    pointsCounter.textContent = `Points: ${totalPoints}`;
                    code += (index + 1).toString();
                    codeString.value = code;
                    updateAttributes();
                }
            };
            attributeRow.appendChild(plusButton);

            popup.appendChild(attributeRow);
        });

        codeString.addEventListener("input", (event) => {
            code = event.target.value;
            updateAttributes();
        });

        // Save build button.
        const createBuildButton = document.createElement("button");
        createBuildButton.id = "createBuildButton";
        createBuildButton.textContent = "Save This Stat Build";
        createBuildButton.onclick = () => {
            const buildName = buildNameInput.value.trim();
            if (buildName === "") {
                alert("Please enter a build name.");
                return;
            }
            // Save build button data.
            let savedButtons = JSON.parse(localStorage.getItem("savedButtons")) || [];
            const newButtonData = { name: buildName, color: "#b8926d", cmd: code };
            savedButtons.push(newButtonData);
            localStorage.setItem("savedButtons", JSON.stringify(savedButtons));

            // Create UI button for this build.
            const buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.alignItems = "center";
            buttonContainer.style.justifyContent = "center";

            const editButton = document.createElement("button");
            editButton.className = "edit-button";
            editButton.textContent = "🖉";
            editButton.style.width = "30px";
            editButton.style.height = "30px";
            editButton.onclick = () => {
                createEditPopup(buttonContainer, newButtonData);
            };
            buttonContainer.appendChild(editButton);

            const newButton = document.createElement("button");
            newButton.className = "button";
            newButton.textContent = buildName;
            newButton.style.backgroundColor = "#b8926d";
            newButton.style.width = "100px";
            newButton.style.height = "30px";
            newButton.onclick = () => {
                const spawnName = userInput.value.trim();
                window.input.execute(`game_spawn ${spawnName}`);
                window.input.execute(`game_stats_build ${code}`);
                const hoverMenu = document.getElementById("myhover");
                if (hoverMenu) {
                    hoverMenu.style.display = hoverMenu.style.display === "none" ? "block" : "none";
                }
            };
            buttonContainer.appendChild(newButton);

            buildButtonsContainer.appendChild(buttonContainer);
            document.body.removeChild(popup);
        };
        popup.appendChild(createBuildButton);
        document.body.appendChild(popup);
        dragElement(popup);
    };

    modMenu.appendChild(specialButton);
    modMenu.appendChild(topRightButton);
    hoverMenu.appendChild(modMenu);
    document.body.appendChild(hoverMenu);

    /* ============================================================
     * Toggle hover menu with R key.
     * ============================================================ */
    document.addEventListener("keydown", (event) => {
        if ((event.key === "r" || event.key === "R") && !["INPUT", "TEXTAREA"].includes(event.target.tagName)) {
            const hoverMenu = document.getElementById("myhover");
            if (hoverMenu) {
                hoverMenu.style.display = hoverMenu.style.display === "none" ? "block" : "none";
            }
        }
    });

    /* ============================================================
     * On window load, build saved buttons from localStorage.
     * ============================================================ */
    window.onload = () => {
        const savedButtons = JSON.parse(localStorage.getItem("savedButtons")) || [];
        savedButtons.forEach(buttonData => createButton(buttonData));
    };

    // Save username on input changes.
    document.getElementById("userInput").addEventListener("input", (event) => {
        localStorage.setItem("quickSpawnUsername", event.target.value);
    });

    // Refresh action on top right button.
    topRightButton.addEventListener("click", () => {
        const resetPopup = document.createElement("div");
        resetPopup.className = "popup";

        const closeButton = document.createElement("button");
        closeButton.className = "close-btn";
        closeButton.textContent = "X";
        closeButton.onclick = () => {
            document.body.removeChild(resetPopup);
        };
        resetPopup.appendChild(closeButton);

        const confirmationMessage = document.createElement("div");
        confirmationMessage.textContent = "Do you really want to reset to default builds?";
        confirmationMessage.style.textAlign = "center";
        confirmationMessage.style.marginBottom = "20px";
        resetPopup.appendChild(confirmationMessage);

        const buttonsContainer = document.createElement("div");
        buttonsContainer.style.display = "flex";
        buttonsContainer.style.justifyContent = "space-between";

        const noButton = document.createElement("button");
        noButton.className = "button";
        noButton.textContent = "NO";
        noButton.onclick = () => {
            document.body.removeChild(resetPopup);
        };
        buttonsContainer.appendChild(noButton);

        const yesButton = document.createElement("button");
        yesButton.className = "button";
        yesButton.textContent = "YES";
        yesButton.onclick = () => {
            localStorage.removeItem("savedButtons");
            localStorage.removeItem("removedDefaults");
            location.reload();
        };
        buttonsContainer.appendChild(yesButton);

        resetPopup.appendChild(buttonsContainer);
        document.body.appendChild(resetPopup);
        dragElement(resetPopup);
    });

    /* ============================================================
     * Drag Functionality for draggable popups.
     * ============================================================ */
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (elmnt.querySelector(".popup-header")) {
            elmnt.querySelector(".popup-header").onmousedown = dragMouseDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
        }
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    /* ============================================================
     * Edit Popup: Allows user to edit or remove a saved build.
     * ============================================================ */
    function createEditPopup(buttonContainer, buttonData) {
        const popupId = `editPopup-${Date.now()}`;
        const popup = document.createElement("div");
        popup.className = "popup";
        popup.id = popupId;
        popup.innerHTML = `<div class="popup-header" id="${popupId}Header">Drag Window</div>`;
        document.body.appendChild(popup);

        const closeButton = document.createElement("button");
        closeButton.className = "close-btn";
        closeButton.textContent = "X";
        closeButton.onclick = () => {
            document.body.removeChild(popup);
        };
        popup.appendChild(closeButton);

        const buildNameInput = document.createElement("input");
        buildNameInput.type = "text";
        buildNameInput.placeholder = "Enter Build Name";
        buildNameInput.style.display = "block";
        buildNameInput.style.width = "80%";
        buildNameInput.style.margin = "0 auto 10px";
        buildNameInput.value = buttonData.name;
        popup.appendChild(buildNameInput);

        const pointsCounter = document.createElement("div");
        pointsCounter.id = `pointsCounter-${popupId}`;
        pointsCounter.textContent = "Points: 33";
        popup.appendChild(pointsCounter);

        const codeString = document.createElement("input");
        codeString.id = `codeString-${popupId}`;
        codeString.type = "text";
        codeString.value = buttonData.cmd;
        codeString.style.display = "block";
        codeString.style.width = "80%";
        codeString.style.margin = "10px auto";
        popup.appendChild(codeString);

        let totalPoints = 33;
        let code = buttonData.cmd;

        const attributes = [
            { name: "Health Regen", color: "#d9c4a1" },
            { name: "Max Health", color: "#b8926d" },
            { name: "Body Damage", color: "#a67c52" },
            { name: "Bullet Speed", color: "#e3d4b9" },
            { name: "Bullet Penetration", color: "#c1a184" },
            { name: "Bullet Damage", color: "#a67c52" },
            { name: "Reload", color: "#d9c4a1" },
            { name: "Movement Speed", color: "#e3d4b9" }
        ];

        function updateAttributes() {
            totalPoints = 33;
            attributes.forEach((attribute, index) => {
                const attributeRow = document.getElementById(`attributeRow-${popupId}-${index}`);
                const attributeCount = Math.min((code.match(new RegExp(index + 1, "g")) || []).length, 7);
                for (let i = 0; i < 7; i++) {
                    const square = attributeRow.children[i + 1];
                    if (i < attributeCount) {
                        square.style.backgroundColor = attribute.color;
                        square.style.border = "1px solid #5b4636";
                        totalPoints--;
                    } else {
                        square.style.backgroundColor = "gray";
                        square.style.border = "0";
                    }
                }
            });
            pointsCounter.textContent = `Points: ${totalPoints}`;
        }

        attributes.forEach((attribute, index) => {
            const attributeRow = document.createElement("div");
            attributeRow.className = "attribute";
            attributeRow.id = `attributeRow-${popupId}-${index}`;
            attributeRow.style.position = "relative";

            const minusButton = document.createElement("button");
            minusButton.style.padding = "0 5px";
            minusButton.style.border = "1px solid #5b4636";
            minusButton.style.borderRadius = "15px 0 0 15px";
            minusButton.style.width = "32px";
            minusButton.style.height = "32px";
            minusButton.textContent = "-";
            minusButton.onclick = () => {
                const coloredSquares = Array.from(attributeRow.children)
                    .filter(child => child !== plusButton && child.style.backgroundColor === attribute.color);
                if (coloredSquares.length > 0) {
                    const square = coloredSquares[coloredSquares.length - 1];
                    square.style.backgroundColor = "gray";
                    square.style.border = "0";
                    totalPoints++;
                    pointsCounter.textContent = `Points: ${totalPoints}`;
                    code = code.slice(0, -1);
                    codeString.value = code;
                    updateAttributes();
                }
            };
            attributeRow.appendChild(minusButton);

            for (let i = 0; i < 7; i++) {
                const colorDiv = document.createElement("div");
                colorDiv.style.backgroundColor = "gray";
                colorDiv.style.width = "30px";
                colorDiv.style.height = "30px";
                colorDiv.style.display = "inline-block";
                colorDiv.style.margin = "0 3px";
                if (i === 3) {
                    const textSpan = document.createElement("span");
                    textSpan.textContent = attribute.name;
                    textSpan.style.position = "absolute";
                    textSpan.style.top = "50%";
                    textSpan.style.left = "50%";
                    textSpan.style.transform = "translate(-50%, -50%)";
                    textSpan.style.color = "#f1e3d3";
                    textSpan.style.fontSize = "10px";
                    textSpan.style.textShadow = "1px 1px 1px #5b4636";
                    colorDiv.appendChild(textSpan);
                }
                attributeRow.appendChild(colorDiv);
            }

            const plusButton = document.createElement("button");
            plusButton.style.padding = "0 5px";
            plusButton.style.border = "1px solid #5b4636";
            plusButton.style.borderRadius = "0 15px 15px 0";
            plusButton.style.width = "32px";
            plusButton.style.height = "32px";
            plusButton.style.fontWeight = "bold";
            plusButton.textContent = "+";
            plusButton.style.backgroundColor = attribute.color;
            plusButton.onclick = () => {
                const graySquares = Array.from(attributeRow.children)
                    .filter(child => child.style.backgroundColor === "gray" && child !== plusButton);
                if (graySquares.length > 0) {
                    const square = graySquares[0];
                    square.style.backgroundColor = attribute.color;
                    square.style.border = "1px solid #5b4636";
                    totalPoints--;
                    pointsCounter.textContent = `Points: ${totalPoints}`;
                    code += (index + 1).toString();
                    codeString.value = code;
                    updateAttributes();
                }
            };
            attributeRow.appendChild(plusButton);

            popup.appendChild(attributeRow);
        });

        codeString.addEventListener("input", (event) => {
            code = event.target.value;
            updateAttributes();
        });

        const deleteButton = document.createElement("button");
        deleteButton.id = `deleteButton-${popupId}`;
        deleteButton.textContent = "Delete Build";
        deleteButton.style.display = "block";
        deleteButton.style.margin = "10px auto";
        deleteButton.style.width = "80%";
        deleteButton.style.fontSize = "14px";
        deleteButton.style.color = "#5b4636";
        deleteButton.style.backgroundColor = "#f1e3d3";
        deleteButton.style.border = "2px solid #5b4636";
        deleteButton.style.borderRadius = "5px";
        deleteButton.style.cursor = "pointer";
        deleteButton.onclick = () => {
            const confirmationPopup = document.createElement("div");
            confirmationPopup.className = "popup";
            confirmationPopup.id = `confirmationPopup-${popupId}`;
            confirmationPopup.innerHTML = `<div class="popup-header" id="confirmationPopupHeader-${popupId}">Drag Window</div>`;
            document.body.appendChild(confirmationPopup);

            const confirmationMessage = document.createElement("div");
            confirmationMessage.textContent = "Are you sure you want to delete this build?";
            confirmationMessage.style.textAlign = "center";
            confirmationMessage.style.marginBottom = "20px";
            confirmationPopup.appendChild(confirmationMessage);

            const buttonsContainer = document.createElement("div");
            buttonsContainer.style.display = "flex";
            buttonsContainer.style.justifyContent = "space-between";

            const noButton = document.createElement("button");
            noButton.className = "button";
            noButton.textContent = "NO";
            noButton.onclick = () => {
                document.body.removeChild(confirmationPopup);
            };
            buttonsContainer.appendChild(noButton);

            const yesButton = document.createElement("button");
            yesButton.className = "button";
            yesButton.textContent = "YES";
            yesButton.onclick = () => {
                buttonContainer.remove();
                const updatedButtons = JSON.parse(localStorage.getItem("savedButtons")) || [];
                const newSavedButtons = updatedButtons.filter(b => b.name !== buttonData.name);
                localStorage.setItem("savedButtons", JSON.stringify(newSavedButtons));
                document.body.removeChild(confirmationPopup);
                document.body.removeChild(popup);
            };
            buttonsContainer.appendChild(yesButton);

            confirmationPopup.appendChild(buttonsContainer);
            document.body.appendChild(confirmationPopup);
            dragElement(confirmationPopup);
        };
        popup.appendChild(deleteButton);

        const saveChangesButton = document.createElement("button");
        saveChangesButton.id = `saveChangesButton-${popupId}`;
        saveChangesButton.textContent = "Save Changes";
        saveChangesButton.style.display = "block";
        saveChangesButton.style.margin = "10px auto";
        saveChangesButton.style.width = "80%";
        saveChangesButton.style.fontSize = "14px";
        saveChangesButton.style.color = "#5b4636";
        saveChangesButton.style.backgroundColor = "#f1e3d3";
        saveChangesButton.style.border = "2px solid #5b4636";
        saveChangesButton.style.borderRadius = "5px";
        saveChangesButton.style.cursor = "pointer";
        saveChangesButton.onclick = () => {
            const buildName = buildNameInput.value.trim();
            if (buildName === "") {
                alert("Please enter a build name.");
                return;
            }
            buttonData.name = buildName;
            buttonData.cmd = codeString.value;
            const button = buttonContainer.querySelector(".button");
            button.textContent = buildName;
            const savedButtons = JSON.parse(localStorage.getItem("savedButtons")) || [];
            const updatedButtons = savedButtons.map(b => b.name === buttonData.name ? buttonData : b);
            localStorage.setItem("savedButtons", JSON.stringify(updatedButtons));
            document.body.removeChild(popup);
        };
        popup.appendChild(saveChangesButton);

        document.body.appendChild(popup);
        dragElement(popup);
    }

    function createButton(buttonData) {
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.alignItems = "center";
        buttonContainer.style.justifyContent = "center";

        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.textContent = "🖉";
        editButton.onclick = () => {
            createEditPopup(buttonContainer, buttonData);
        };
        buttonContainer.appendChild(editButton);

        const button = document.createElement("button");
        button.className = "button";
        button.textContent = buttonData.name;
        button.style.backgroundColor = buttonData.color;
        button.onclick = () => {
            const spawnName = userInput.value.trim();
            window.input.execute(`game_spawn ${spawnName}`);
            window.input.execute(`game_stats_build ${buttonData.cmd}`);
            const hoverMenu = document.getElementById("myhover");
            if (hoverMenu) {
            hoverMenu.style.display = hoverMenu.style.display === "none" ? "block" : "none";
    }
};
buttonContainer.appendChild(button);
buildButtonsContainer.appendChild(buttonContainer);
}

// 🔽 INSERT THIS BLOCK BEFORE THE FINAL })();

document.addEventListener("keydown", (event) => {
    if (event.key === "\\") {
        const hoverMenu = document.getElementById("myhover");
        if (hoverMenu) {
            hoverMenu.style.display = (hoverMenu.style.display === "none") ? "block" : "none";
        }
    }
});

// 👇 Final closure of the IIFE
})();


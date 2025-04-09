// ==UserScript==
// @name         Diep.io Discord + Update Log Remover
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Removes the Discord promo and green update log in Diep.io ONLY (leaves all else untouched)
// @author       earthwindfirereal
// @match        *://diep.io/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // Leave this untouched — Discord promo remover
    GM_addStyle(`
        div[style*="Join the Diep.io Discord"],
        div[style*="discord"],
        div[style*="bottom: 0"],
        div[class*="promo"],
        div[class*="discord"],
        canvas[width="256"][height="256"],
        img[src*="discord"],
        a[href*="discord.gg"],
        a[href*="discord.com"],
        div[style*="Join"],
        div[style*="Diep.io"],
        div[style*="Discord"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `);

    // Separate logic to safely remove update log only
    function removeUpdateLog() {
        document.querySelectorAll("div").forEach(el => {
            const text = el.textContent;
            if (
                text?.includes("Last updated") &&
                /\b(updated\s+[A-Z]?[a-z]+\s+\d{1,2}(st|nd|rd|th)?)/i.test(text) &&
                text.length < 200
            ) {
                el.remove();
            }
        });
    }

    // Run once after DOM loads, and continue observing
    setTimeout(() => {
        removeUpdateLog();

        const observer = new MutationObserver(removeUpdateLog);
        observer.observe(document.body, { childList: true, subtree: true });
    }, 1000);
})();

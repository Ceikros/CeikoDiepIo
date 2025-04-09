// ==UserScript==
// @name         Diep.io Hardcore Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Blocks all known ad elements and requests on diep.io, including Bing and Eiendomsmegler native ads
// @author       eartwindfirelolreal
// @match        *://*.diep.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const hardcoreBlocklist = [
        "bing.com", "eiendomsmegler.no", "doubleclick.net", "googlesyndication.com",
        "adservice.google.com", "googleads.g.doubleclick.net", "adnxs.com", "adform.net",
        "zedo.com", "moatads.com", "yieldmo.com", "media.net", "outbrain.com", "taboola.com",
        "linkvertise.com", "lootlinks.com", "adfly.com", "shorte.st", "propellerads.com",
        "popads.net", "tradedoubler.com", "revcontent.com", "mgid.com"
    ];

    const style = document.createElement("style");
    style.innerHTML = `
        iframe[src*="bing.com"], a[href*="bing.com"],
        iframe[src*="eiendomsmegler.no"], a[href*="eiendomsmegler.no"],
        div:has(iframe[src*="eiendomsmegler.no"]), div:has(a[href*="eiendomsmegler.no"]),
        div[class*="ad"], div[id*="ad"], div[class*="sponsor"], div[id*="sponsor"],
        [aria-label*="ad"], [aria-label*="sponsored"], [data-testid*="ad"],
        iframe[src*="ads"], a[href*="ads"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    // Mutation Observer for new ads
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (hardcoreBlocklist.some(domain => {
                    return (
                        (node.src && node.src.includes(domain)) ||
                        (node.href && node.href.includes(domain)) ||
                        (node.innerHTML && node.innerHTML.includes(domain))
                    );
                })) {
                    node.remove();
                }
                if (node.querySelectorAll) {
                    node.querySelectorAll('*').forEach(child => {
                        if (hardcoreBlocklist.some(domain => {
                            return (
                                (child.src && child.src.includes(domain)) ||
                                (child.href && child.href.includes(domain)) ||
                                (child.innerHTML && child.innerHTML.includes(domain))
                            );
                        })) {
                            child.remove();
                        }
                    });
                }
            });
        }
    });

    const startObserver = () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    if (document.readyState !== "loading") {
        startObserver();
    } else {
        document.addEventListener("DOMContentLoaded", startObserver);
    }

    // Network request blocking
    const blockRequest = (url) => {
        return hardcoreBlocklist.some(domain => url.includes(domain));
    };

    const originalFetch = window.fetch;
    window.fetch = function () {
        const url = arguments[0];
        if (typeof url === "string" && blockRequest(url)) {
            console.log("Blocked fetch to:", url);
            return Promise.resolve(new Response("", { status: 204 }));
        }
        return originalFetch.apply(this, arguments);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (typeof url === "string" && blockRequest(url)) {
            console.log("Blocked XHR to:", url);
            this.abort();
            return;
        }
        return originalOpen.apply(this, arguments);
    };

    // Rapid scan loop
    setInterval(() => {
        document.querySelectorAll('a[href], iframe[src]').forEach(el => {
            const src = el.src || el.href;
            if (src && blockRequest(src)) {
                el.remove();
            }
        });
    }, 40); // 40ms = 25 checks/second
})();

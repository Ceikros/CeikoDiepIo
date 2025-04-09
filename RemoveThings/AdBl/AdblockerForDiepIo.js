// ==UserScript==
// @name         Diep.io UBlock-Style Ad Blocker (Improved)
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Blocks in-game ads and dynamically loaded ones with 100ms scan interval
// @author       you
// @match        *://*.diep.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const adUrlPatterns = [
        'doubleclick.net',
        'google-analytics.com',
        'googlesyndication.com',
        'googleadservices.com',
        'adsystem',
        'adservice',
        'bing.com/api',
        'bing.com/aclick',
        'mediation/tracking',
        'adunit=',
        'bidderid=',
        'trafficgroup=',
        'eiendomsmegler.no',
        'adf.ly',
        'linkvertise.com',
        'lootlinks',
        'shortly',
        'shorte.st',
        't.co',
        'clickbank.net',
        'outbrain.com',
        'taboola.com'
    ];

    const adTextIndicators = [
        'advertisement',
        'advertisment',
        'sponsored',
        'promotion',
        'publicity',
        'ad',
        'ads',
        'advert',
        'eiendomsmegler',
        'megler'
    ];

    function hideAdElement(el) {
        if (!el || el.hasAttribute('data-adblocked')) return;
        if (['HTML', 'BODY', 'HEAD', 'CANVAS'].includes(el.tagName)) return;

        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.setAttribute('data-adblocked', 'true');
    }

    function isLikelyAd(el) {
        if (!el.tagName || ['SCRIPT', 'STYLE'].includes(el.tagName)) return false;

        const text = (el.textContent || '').toLowerCase();
        if (adTextIndicators.some(ind => text === ind)) return true;

        const id = (el.id || '').toLowerCase();
        const cls = (typeof el.className === 'string' ? el.className : '').toLowerCase();
        if ((id.includes('ad') && id.length < 10) || id.includes('banner') || id.includes('promo')) return true;
        if ((cls.includes('ad') && cls.length < 10) || cls.includes('banner') || cls.includes('promo')) return true;

        if (el.tagName === 'A' && el.href) {
            const href = el.href.toLowerCase();
            if (adUrlPatterns.some(p => href.includes(p))) return true;
        }

        if (el.tagName === 'IFRAME' && el.src) {
            const src = el.src.toLowerCase();
            if (adUrlPatterns.some(p => src.includes(p))) return true;
        }

        return false;
    }

    function processNewElements(nodes) {
        nodes.forEach(node => {
            if (node.nodeType !== 1 || node.hasAttribute('data-adblocked')) return;

            if (isLikelyAd(node)) {
                hideAdElement(node);
                return;
            }

            if (node.tagName && node.textContent?.trim().toLowerCase() === 'advertisement') {
                hideAdElement(node);
                if (node.parentElement && node.parentElement.children.length <= 3) {
                    hideAdElement(node.parentElement);
                }
                return;
            }

            if (node.children?.length > 0) {
                processNewElements([...node.children]);
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                processNewElements([...mutation.addedNodes]);
            }
        }
    });

    function startObserver() {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            processNewElements([...document.body.children]);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }

    // Request blocking
    const origFetch = window.fetch;
    window.fetch = function (url, opts) {
        if (typeof url === 'string' && adUrlPatterns.some(p => url.toLowerCase().includes(p))) {
            console.log('Blocked fetch:', url);
            return Promise.resolve(new Response('', { status: 200 }));
        }
        return origFetch.apply(this, arguments);
    };

    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (typeof url === 'string' && adUrlPatterns.some(p => url.toLowerCase().includes(p))) {
            console.log('Blocked XHR:', url);
            this.abort();
            return;
        }
        return origOpen.apply(this, arguments);
    };

    // Aggressive periodic scanner every 100ms
    setInterval(() => {
        document.querySelectorAll('a[href*="eiendomsmegler.no"]').forEach(el => {
            hideAdElement(el);
            if (el.parentElement) hideAdElement(el.parentElement);
        });

        const adTextEls = document.evaluate(
            "//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'advertisement')]",
            document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null
        );

        for (let i = 0; i < adTextEls.snapshotLength; i++) {
            const el = adTextEls.snapshotItem(i);
            if (el && !el.hasAttribute('data-adblocked')) {
                hideAdElement(el);
                if (el.parentElement && el.parentElement.children.length <= 3) {
                    hideAdElement(el.parentElement);
                }
            }
        }

        document.querySelectorAll('div[class*="banner"], div[id*="banner"]').forEach(el => {
            if (!el.hasAttribute('data-adblocked')) hideAdElement(el);
        });

        // All <a> ad link checks
        document.querySelectorAll('a[href]').forEach(el => {
            const href = el.href.toLowerCase();
            if (adUrlPatterns.some(p => href.includes(p))) {
                hideAdElement(el);
                if (el.parentElement) hideAdElement(el.parentElement);
            }
        });

    }, 100); // 100ms

    console.log('[✓] Diep.io Ad Blocker initialized (100ms scan rate)');
})();

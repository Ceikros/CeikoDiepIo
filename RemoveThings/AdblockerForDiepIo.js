// ==UserScript==
// @name         Diep.io UBlock-Style Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Precision ad blocker for diep.io - targets ads while preserving game functionality
// @author       eartwindfirelolreal
// @match        *://*.diep.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to create filters
    function createFilter(selectors) {
        return selectors.join(',\n');
    }

    // ==== Specific Cosmetic Filters ====
    // Similar to how uBlock creates its filters

    // Generic ad selectors
    const genericAdSelectors = [
        // Text indicators
        'div:has(span:contains("Advertisement"))',
        'div:has(div:contains("Advertisement"))',
        'div:has(p:contains("Advertisement"))',
        'div > span:contains("Advertisement")',
        'div[aria-label="Advertisement"]',
        'div[aria-label="advertisement"]',

        // Standard ad containers
        '.adsbygoogle',
        '#adContainer',
        '.googleAdBlock',
        'div[class*="ad-container"]',
        'div[id*="div-gpt-ad"]',
        'ins.adsbygoogle',

        // Bing ads
        'a[href*="bing.com/api/v1/mediation"]',
        'a[href*="bing.com/aclick"]',
        'a.css-11nz0s2',

        // Norwegian ad example
        'div:has(a[href*="Eiendomsmegler.no"])',
        'div:has(a[href*="megler"])',

        // Common ad banner layouts
        'div[style*="position: fixed"][style*="bottom"]',
        'div[style*="position:fixed"][style*="bottom"]',
        'div[style*="position: fixed"][style*="top"]',
        'div[style*="position:fixed"][style*="top"]'
    ];

    // Create style element
    const style = document.createElement('style');
    style.id = 'diep-io-ad-blocker';
    style.innerHTML = createFilter(genericAdSelectors) + ' { display: none !important; }';

    // Inject style into document
    function injectStyles() {
        document.head.appendChild(style);
    }

    // Try to inject immediately
    if (document.head) {
        injectStyles();
    } else {
        // If document.head is not available yet
        document.addEventListener('DOMContentLoaded', injectStyles);
    }

    // ==== Dynamic Ad Removal Logic ====

    // Words that indicate an ad element
    const adTextIndicators = [
        'advertisement',
        'advertisment', // common misspelling
        'sponsored',
        'promotion',
        'publicity',
        'ad',
        'ads',
        'advert',
        'eiendomsmegler',
        'megler'
    ];

    // URL patterns that indicate ad resources
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
        'adUnit=',
        'bidderId=',
        'trafficGroup='
    ];

    // Function to determine if element is likely an ad
    function isLikelyAd(element) {
        // Skip text nodes and script tags
        if (!element.tagName || element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
            return false;
        }

        // Check if this is a core game element we should preserve
        if (element.id === 'canvas' ||
            element.className === 'game' ||
            element.tagName === 'CANVAS' ||
            element.id === 'gameCanvas') {
            return false;
        }

        // Don't block body or essential page structure
        if (element.tagName === 'BODY' ||
            element.tagName === 'HTML' ||
            element.tagName === 'HEAD') {
            return false;
        }

        // Check for ad text in content
        if (element.textContent) {
            const text = element.textContent.toLowerCase();
            if (adTextIndicators.some(indicator => text === indicator)) {
                return true;
            }
        }

        // Check link destinations
        if (element.tagName === 'A' && element.href) {
            const href = element.href.toLowerCase();
            if (adUrlPatterns.some(pattern => href.includes(pattern))) {
                return true;
            }
        }

        // Check iframe sources
        if (element.tagName === 'IFRAME' && element.src) {
            const src = element.src.toLowerCase();
            if (adUrlPatterns.some(pattern => src.includes(pattern))) {
                return true;
            }
        }

        // Check element attributes
        const id = (element.id || '').toLowerCase();
        const className = (typeof element.className === 'string' ? element.className : '').toLowerCase();

        if ((id.includes('ad') && id.length < 10) ||
            id.includes('banner') ||
            id.includes('promo') ||
            (className.includes('ad') && className.length < 10) ||
            className.includes('banner') ||
            className.includes('promo')) {
            return true;
        }

        return false;
    }

    // Function to safely remove an ad without breaking the page
    function hideAdElement(element) {
        // Check if it's a critical game element first
        if (element.id === 'canvas' ||
            element.className === 'game' ||
            element.tagName === 'CANVAS' ||
            element.id === 'gameCanvas') {
            return;
        }

        // Check if it's a top-level page element
        if (element.tagName === 'BODY' ||
            element.tagName === 'HTML' ||
            element.tagName === 'HEAD') {
            return;
        }

        // Hide the ad element
        element.style.setProperty('display', 'none', 'important');
        element.style.setProperty('visibility', 'hidden', 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('pointer-events', 'none', 'important');

        // Mark it as processed
        element.setAttribute('data-adblocked', 'true');
    }

    // Process newly added elements
    function processNewElements(nodeList) {
        nodeList.forEach(node => {
            // Skip text nodes and already processed nodes
            if (node.nodeType !== 1 || node.hasAttribute('data-adblocked')) {
                return;
            }

            // Check if this node is an ad
            if (isLikelyAd(node)) {
                hideAdElement(node);
                return;
            }

            // Special case for Advertisement text
            if (node.tagName && node.textContent &&
                node.textContent.trim() === 'Advertisement') {
                hideAdElement(node);
                // Also hide parent if it's a container
                if (node.parentElement && node.parentElement.children.length <= 2) {
                    hideAdElement(node.parentElement);
                }
                return;
            }

            // Process child elements
            if (node.children && node.children.length > 0) {
                processNewElements(node.children);
            }
        });
    }

    // MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                processNewElements(mutation.addedNodes);
            }
        });
    });

    // Start the observer
    function startObserver() {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Initial scan of existing elements
            processNewElements(document.body.children);
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }

    // ==== Request Blocking (like uBlock's network filters) ====

    // Block ad-related network requests
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' &&
            adUrlPatterns.some(pattern => url.toLowerCase().includes(pattern))) {
            console.log('Blocked fetch request to:', url);
            return new Promise(resolve => {
                resolve(new Response('', {
                    status: 200,
                    headers: {'Content-Type': 'text/plain'}
                }));
            });
        }
        return originalFetch.apply(this, arguments);
    };

    // Block ad-related XMLHttpRequests
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string' &&
            adUrlPatterns.some(pattern => url.toLowerCase().includes(pattern))) {
            console.log('Blocked XHR request to:', url);
            this.abort();
            return;
        }
        return originalOpen.apply(this, arguments);
    };

    // Periodic scan for any ads that might have slipped through
    // This uses a less aggressive approach than previous versions
    setInterval(() => {
        // Target specific ad texts
        const adTextElements = document.evaluate(
            "//*[contains(text(), 'Advertisement')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < adTextElements.snapshotLength; i++) {
            const element = adTextElements.snapshotItem(i);
            if (element && !element.hasAttribute('data-adblocked')) {
                hideAdElement(element);
                // Also hide parent if it's a container
                if (element.parentElement && element.parentElement.children.length <= 2) {
                    hideAdElement(element.parentElement);
                }
            }
        }

        // Check for common ad banners
        const adBanners = document.querySelectorAll('div[class*="banner"], div[id*="banner"]');
        adBanners.forEach(banner => {
            if (!banner.hasAttribute('data-adblocked')) {
                hideAdElement(banner);
            }
        });
    }, 2000);

    console.log('Diep.io UBlock-Style Ad Blocker initialized');
})();

// ==UserScript==

// @name         Remove Twitter Discover More Section

// @namespace    https://davidstudios.uk

// @version      1.1

// @description  Removes the "Discover More" section on tweet replies

// @author       DavidTDC3377

// @match        *://*.twitter.com/*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com

// @grant        none

// ==/UserScript==

"use strict";

(() => {

    /**

     * Calls the provided callback when the document is loaded

     */

    function onReady(fn) {

        if (document.readyState != "loading") {

            fn();

        }

        else {

            document.addEventListener("DOMContentLoaded", fn);

        }

    }

    /**

     * Waits for Element added as a descendant of `parent` that matches `selector`.

     */

    function waitForElement(parent, selector, callback, runOnce = true) {

        const elementNow = parent.querySelector(selector);

        if (elementNow) {

            callback(elementNow);

            if (runOnce) {

                return;

            }

        }

        const observer = new MutationObserver((records) => {

            records.forEach((record) => {

                record.addedNodes.forEach((element) => {

                    if (element instanceof Element) {

                        if (element.matches(selector)) {

                            if (runOnce) {

                                observer.disconnect();

                            }

                            callback(element);

                        }

                    }

                });

            });

        });

        observer.observe(parent, {

            childList: true,

            subtree: true,

        });

    }

    function deleteAllNextSiblings(element) {

        while (true) {

            const nextElement = element.nextElementSibling;

            if (!nextElement)

                break;

            nextElement.remove();

        }

    }

    onReady(() => {

        waitForElement(document, "div[data-testid='cellInnerDiv']", (element) => {

            if (!(element instanceof HTMLElement))

                return;

            if (!element.outerText.includes("Discover more\nSourced from across Twitter"))

                return;

            setTimeout(() => {

                element.children[0].remove();

                deleteAllNextSiblings(element);

                const loop = setInterval(() => {

                    if (element.parentElement)

                        deleteAllNextSiblings(element);

                    else

                        clearInterval(loop);

                }, 100);

            }, 50);

        }, false);

    });

})();

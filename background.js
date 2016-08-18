/*  
    Copyright 2016 Laser Nite

    This file is part of Websee Extension.

    Websee Extension is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Websee Extension is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Websee Extension.  If not, see <http://www.gnu.org/licenses/>.
*/


// On page change send new URL and Title
chrome.webNavigation.onCompleted.addListener(function(details) {
	sendDataIfUrlChange(details);
})

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
	sendDataIfUrlChange(details);
})

function sendDataIfUrlChange(details) {
	// Get the tab id from which the navigation was made
	var tabId = details.tabId
	// Get the tab
	chrome.tabs.get(tabId, function(tab) {
		// Send URL and Title, if it has changed since the last call
		if (window.oldUrl != tab.url) {
			var url = tab.url;
			var title = tab.title;

			var data = JSON.stringify({
			  "url": url,
			  "title": title
			});

			var xhr = new XMLHttpRequest();
			// xhr.withCredentials = true;

			// xhr.open("POST", "http://localhost:3000/visits/create.json");
			xhr.open("POST", "https://websee.herokuapp.com/visits/create.json");
			xhr.setRequestHeader("content-type", "application/json");
			xhr.setRequestHeader("charset", "utf-8");
			xhr.setRequestHeader("cache-control", "no-cache");

			xhr.send(data);
		}
		// Update oldUrl with current url, for next call
		window.oldUrl = tab.url
	});
}

// Parsing HTML
let { Cc, Ci } = require("chrome");
/*
 * Safely parse an HTML fragment, removing any executable
 * JavaScript, and return a document fragment.
 *
 * @param {Document} doc The document in which to create the
 *     returned DOM tree.
 * @param {string} html The HTML fragment to parse.
 * @param {boolean} allowStyle If true, allow <style> nodes and
 *     style attributes in the parsed fragment. Gecko 14+ only.
 * @param {nsIURI} baseURI The base URI relative to which resource
 *     URLs should be processed. Note that this will not work for
 *     XML fragments.
 * @param {boolean} isXML If true, parse the fragment as XML.
 */
function parseHTML(doc, html, allowStyle, baseURI, isXML) {
    let PARSER_UTILS = "@mozilla.org/parserutils;1";

    // User the newer nsIParserUtils on versions that support it.
    if (PARSER_UTILS in Cc) {
        let parser = Cc[PARSER_UTILS]
                               .getService(Ci.nsIParserUtils);
        if ("parseFragment" in parser)
            return parser.parseFragment(html, allowStyle ? parser.SanitizerAllowStyle : 0,
                                        !!isXML, baseURI, doc.documentElement);
    }

    return Cc["@mozilla.org/feed-unescapehtml;1"]
                     .getService(Ci.nsIScriptableUnescapeHTML)
                     .parseFragment(html, !!isXML, baseURI, doc.documentElement);
}



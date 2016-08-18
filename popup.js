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

// let { Cc, Ci } = require("chrome");
// /*
//  * Safely parse an HTML fragment, removing any executable
//  * JavaScript, and return a document fragment.
//  *
//  * @param {Document} doc The document in which to create the
//  *     returned DOM tree.
//  * @param {string} html The HTML fragment to parse.
//  * @param {boolean} allowStyle If true, allow <style> nodes and
//  *     style attributes in the parsed fragment. Gecko 14+ only.
//  * @param {nsIURI} baseURI The base URI relative to which resource
//  *     URLs should be processed. Note that this will not work for
//  *     XML fragments.
//  * @param {boolean} isXML If true, parse the fragment as XML.
//  */
// function parseHTML(doc, html, allowStyle, baseURI, isXML) {
//     let PARSER_UTILS = "@mozilla.org/parserutils;1";

//     // User the newer nsIParserUtils on versions that support it.
//     if (PARSER_UTILS in Cc) {
//         let parser = Cc[PARSER_UTILS]
//                                .getService(Ci.nsIParserUtils);
//         if ("parseFragment" in parser)
//             return parser.parseFragment(html, allowStyle ? parser.SanitizerAllowStyle : 0,
//                                         !!isXML, baseURI, doc.documentElement);
//     }

//     return Cc["@mozilla.org/feed-unescapehtml;1"]
//                      .getService(Ci.nsIScriptableUnescapeHTML)
//                      .parseFragment(html, !!isXML, baseURI, doc.documentElement);
// }



// Get URL and Load Corresponding Websee Discussion
var xhr = new XMLHttpRequest();
// xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {

    // var target = document.getElementsByTagName("BODY")[0];
    // var fragment = Components.classes["@mozilla.org/feed-unescapehtml;1"]
    //                      .getService(Components.interfaces.nsIScriptableUnescapeHTML)
    //                      .parseFragment("this is a description", false, null, target);
    // target.appendChild(fragment);

    // Load Main Content on dropdown
    var el = document.getElementsByTagName("BODY")[0],
         elChild = document.createElement('div');
    elChild.innerHTML = this.responseText;
    el.insertBefore(elChild, el.firstChild);
    // document.body.appendChild(parseHTML(document, this.responseText, true, this.channel.URI));


    // Frontend Logic
    var share = document.getElementById('share_button');
    var shared = document.getElementById('shared_button');
    share.addEventListener('click', function() {
        sharePost()
        share.classList.toggle('hidden');
        shared.classList.toggle('hidden');
    });
    shared.addEventListener('click', function() {
        sharePost()
        share.classList.toggle('hidden');
        shared.classList.toggle('hidden');
    });

  };
});

chrome.tabs.query({active: true, currentWindow: true}, 
    function callback(tabs) {

        xhr.open("POST", "https://www.websee.io/visits/url") ;
        // xhr.open("POST", "http://localhost:3000/visits/url");

        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("charset", "utf-8");
        xhr.setRequestHeader("cache-control", "no-cache");

        var data = JSON.stringify({ "url": tabs[0].url });
        //encodeURIComponent(tabs[0].url)

        xhr.send(data);
    });

function sharePost() {
    // Post/Share URL to Websee
    var xhrPost = new XMLHttpRequest();
    // xhrPost.withCredentials = true;

    xhrPost.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        // Changes on success
      }
    });

    chrome.tabs.query({active: true, currentWindow: true}, 
        function callback(tabs) {

            xhrPost.open("POST", "https://www.websee.io/posts/share") ;
            // xhrPost.open("POST", "http://localhost:3000/posts/share");

            xhrPost.setRequestHeader("content-type", "application/json");
            xhrPost.setRequestHeader("charset", "utf-8");
            xhrPost.setRequestHeader("cache-control", "no-cache");

            var data = JSON.stringify({ "url": tabs[0].url });
            //encodeURIComponent(tabs[0].url)

            xhrPost.send(data);
        });
};


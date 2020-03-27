var shortcuts = [];
var shortcutsMap = {};

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  shortcuts = request.shortcuts

  shortcutsMap = {};
  shortcuts.map(([shortcut, url]) => shortcutsMap[shortcut] = url);
});

// This event is fired with the user accepts the input in the omnibox
chrome.omnibox.onInputEntered.addListener((text) => {
  console.log(`> Processing omnibox entry. text: ${text.trim()}`)
  console.log(shortcutsMap);

  text = text.trim();

  if (shortcutsMap.hasOwnProperty(text)) {
    chrome.tabs.update({url: shortcutsMap[text]})
  }


  // // Encode user input for special characters , / ? : @ & = + $ #
  // var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
  // console.log(newURL);
});

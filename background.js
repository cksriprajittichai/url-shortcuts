var shortcuts = [];
var shortcutsMap = {};

const onShortcutsLoaded = (res) => {
  console.log('>>> onShortcutsLoaded');
  console.log(res);
  if (!res.hasOwnProperty('shortcuts')) {
    // Nothing in storage, so table is empty and nothing to do
    return;
  }

  const existingShortcuts = res['shortcuts'];
  onShortcutsChanged(existingShortcuts);
  console.log('<<< onShortcutsLoaded');
};

const onShortcutsChanged = (updatedShortcuts) => {
  console.log('>>> onShortcutsChanged');
  console.log(shortcuts);
  shortcuts = updatedShortcuts

  shortcutsMap = {};
  shortcuts.map(([shortcut, url]) => shortcutsMap[shortcut] = url);
  console.log(shortcuts);
  console.log('<<< onShortcutsChanged');
};



browser.runtime.onMessage.addListener((req, sender, sendRes) => {
  switch (req.type) {
    case 'get-shortcuts':
      sendRes({
        'shortcuts': shortcuts,
        'shortcuts-map': shortcutsMap
      });
      break;
    case 'shortcuts-changed':
      onShortcutsChanged(req.shortcuts);
      break;
    default:
      break;
  }
});

// This event is fired with the user accepts the input in the omnibox
chrome.omnibox.onInputEntered.addListener((shortcut) => {
  shortcut = shortcut.trim();

  console.log(`>>> Processing omnibox entry`);
  console.log(`shortcut: ${shortcut.trim()}`);
  console.log(shortcutsMap);

  if (shortcutsMap.hasOwnProperty(shortcut)) {
    chrome.tabs.update({url: shortcutsMap[shortcut]});
  }
  console.log('<<< Processing omnibox entry');
});

const loadingStorage = browser.storage.sync.get('shortcuts');
loadingStorage
  .then(onShortcutsLoaded)
  .catch((e) => console.log(e));

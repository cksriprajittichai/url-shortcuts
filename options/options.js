var shortcuts = [];

const onShortcutsChanged = () => browser.runtime.sendMessage({'shortcuts': shortcuts});

const updateUi = (res) => {
  if (!res.hasOwnProperty('shortcuts')) {
    // Nothing in storage, so table is empty and nothing to do
    return;
  }

  const existingShortcuts = res['shortcuts'];
  existingShortcuts.map((entry) => {
    const [shortcut, url] = entry;
    addTableEntry(shortcut, url);
  });
};

const onStoredShortcutsLoaded = (res) => {
  updateUi(res);
  onShortcutsChanged();
};

const storeSettings = () => {
  shortcuts = [];  // Completely rebuild shortcuts struct
  const shortcutTable = document.getElementById('shortcut-table');
  for (let r = 1, row; row = shortcutTable.rows[r]; r++) {
    const shortcut = row.cells[0].innerHTML.replace('<br>', '').trim();
    const url = row.cells[1].innerHTML.replace('<br>', '').trim();

    // URL must be non-empty
    if (url !== '') {
      shortcuts.push([shortcut, url]);
    }
  }

  browser.storage.sync.set({
    'shortcuts': shortcuts
  });
};

const addTableEntry = (shortcut = '', url = '') => {
  const shortcutTable = document.getElementById('shortcut-table');

  const row = shortcutTable.insertRow(-1);

  const shortcutCell = row.insertCell(0);
  shortcutCell.appendChild(document.createTextNode(shortcut));
  shortcutCell.setAttribute('contenteditable', true);  // Must do after appending text node for some reason

  const urlCell = row.insertCell(1);
  urlCell.appendChild(document.createTextNode(url));
  urlCell.setAttribute('contenteditable', true);
};

const loadingStorage = browser.storage.sync.get('shortcuts');
loadingStorage.then(onStoredShortcutsLoaded, (e) => console.log(e));

const addEntryBtn = document.getElementById('add-entry');
addEntryBtn.addEventListener('click', () => addTableEntry());

const saveBtn = document.getElementById('save');
saveBtn.addEventListener('click', storeSettings);
saveBtn.addEventListener('click', onShortcutsChanged);

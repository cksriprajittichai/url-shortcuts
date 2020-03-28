var shortcuts = [];

const storeSettings = () => {
  // Completely rebuild shortcuts struct
  shortcuts = [];

  const shortcutTable = document.getElementById('shortcut-table');
  for (let r = 1, row; row = shortcutTable.rows[r]; r++) {
    const shortcut = row.cells[0].firstChild.value.trim();
    const url = row.cells[1].firstChild.value.trim();

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

  const shortcutInput = document.createElement('input');
  shortcutInput.type = 'text';
  shortcutInput.value = shortcut;
  const shortcutCell = row.insertCell(0);
  shortcutCell.appendChild(shortcutInput);

  const urlInput = document.createElement('input');
  urlInput.type = 'url';
  urlInput.value = url;
  const urlCell = row.insertCell(1);
  urlCell.appendChild(urlInput);
};



// Init UI and shortcuts struct
browser.runtime.sendMessage({'type': 'get-shortcuts'})
  .then((res) => {
    shortcuts = res.shortcuts;
    shortcuts.map(([shortcut, url]) => addTableEntry(shortcut, url));
  })
  .catch((err) => console.log(err));

const addEntryBtn = document.getElementById('add-entry');
addEntryBtn.addEventListener('click', () => addTableEntry());

const saveBtn = document.getElementById('save');
saveBtn.addEventListener('click', (e) => {
  storeSettings();

  // Notify background script that shortcuts have changed
  browser.runtime.sendMessage({
    'type': 'shortcuts-changed',
    'shortcuts': shortcuts
  });
});

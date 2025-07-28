
importScripts('functions.js');


async function removeAllContextMenus() {
  return new Promise((resolve) => {
    chrome.contextMenus.removeAll(() => {
      resolve();
    });
  });
}

async function createActionContextMenus() {
  await removeAllContextMenus();
  
  chrome.contextMenus.create({
    id: "support",
    title: "❤️ Support",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "issues",
    title: "🤔 Problèmes et suggestions",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "github",
    title: "🌐 GitHub",
    parentId: "issues",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "reportIssue",
    title: "🐛 Signaler un problème",
    parentId: "issues",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "donate",
    title: "🍕 Faire un don",
    parentId: "support",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "review",
    title: "🌟 Laisser un avis",
    parentId: "support",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "projects",
    title: "🧪 Tous mes projets",
    parentId: "support",
    contexts: ["action"]
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  await createActionContextMenus();
});

chrome.runtime.onStartup.addListener(async () => {
  await createActionContextMenus();
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case "github":
      chrome.tabs.create({ url: 'https://github.com/shevabam/extension-leboncoin-telecharger-photos' });
      break;
    case "reportIssue":
      chrome.tabs.create({ url: 'https://github.com/shevabam/extension-leboncoin-telecharger-photos/issues' });
      break;
    case "donate":
      chrome.tabs.create({ url: 'https://buymeacoffee.com/shevabam' });
      break;
    case "review":
      chrome.tabs.create({ url: `https://chromewebstore.google.com/detail/${chrome.runtime.id}/reviews` });
      break;
    case "projects":
      chrome.tabs.create({ url: `https://shevabam.fr` });
      break;
  }
});
// Dynamically inject the script based on the current path
const pathname = window.location.pathname;

chrome.storage.sync.get("apiKey", function (result) {
  const apiKey = result.apiKey || null;
  if (pathname === "/wonderdome") {
    injectScript("wonderdome.js", { apiKey: apiKey });
  } else if (pathname === "/shop") {
    injectScript("shop.js");
  } else if (pathname === "/shipyard") {
    injectScript("shipyard.js");
  } else if (pathname === "/signpost") {
    injectScript("signpost.js");
  }
});

// Helper to inject a script
function injectScript(scriptName, data = {}) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(scriptName);
  script.type = "text/javascript";
  if (data) {
    Object.keys(data).forEach((key) => {
      script.dataset[key] = data[key];
    });
  }
  document.head.appendChild(script);
}

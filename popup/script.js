let saveButton = document.getElementById("saveButton");
let statusText = document.getElementById("status");
let apiKeyInput = document.getElementById("apiKey");

saveButton.addEventListener("click", function () {
  const apiKey = apiKeyInput.value;
  if (apiKey) {
    chrome.storage.sync.set({ apiKey: apiKey }, function () {
      apiKeyInput.value = "";
      statusText.textContent = "Saved!";

      setTimeout(function () {
        statusText.textContent = "";
      }, 2000);
    });
  } else {
    statusText.textContent = "Please enter an API Key";
    setTimeout(function () {
      statusText.textContent = "";
    }, 2000);
  }
});

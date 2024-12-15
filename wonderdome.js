(function () {
  let textarea;
  const injectedScript = document.currentScript;
  const apiKey = injectedScript ? injectedScript.dataset.apiKey : null;

  // Wait until the element exists, then add a button
  function waitForElement(selector, callback, waitFor = true) {
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if ((waitFor && element) || (!waitFor && !element)) {
        observer.disconnect();
        callback(element);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Add button functionality
  function addButtonToVotingReasonContainer(container) {
    const button = document.createElement("button");
    button.id = "autoWriteButton";
    button.className =
      "bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 mr-3 rounded-lg transition-colors duration-200 text-lg w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed";
    button.onclick = autoWrite;
    if (apiKey) {
      button.textContent = "Autowrite!";
    } else {
      button.textContent = "No API Key (click extension to add)";
      button.disabled = true;
    }
    container.appendChild(button);
  }

  // Handle button click
  function autoWrite() {
    const autoWriteButton = document.getElementById("autoWriteButton");
    autoWriteButton.disabled = true;

    const readmeLinks = document.querySelectorAll("#repository-link");
    let readmeContents = [];
    readmeLinks.forEach((link) => {
      const url = new URL(link.getAttribute("href"));
      const formattedLink = `https://raw.githubusercontent.com${url.pathname}/refs/heads/main/README.md`;
      fetch(formattedLink)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((readmeContent) => {
          readmeContents.push(readmeContent);
        })
        .catch((error) => {
          console.error("Error fetching README content:", error);
        });
    });

    const votingReasonContainer = document.getElementById("voting-reason-container");
    const firstH3 = votingReasonContainer ? votingReasonContainer.querySelector("h3") : null;
    let vote = firstH3 ? firstH3.textContent : "No specifc vote, give your best guess.";

    let promptContent = `Write 2 or less concise sentences about ${vote}. Assume both projects are programming projects. Write without big vocabulary. Give your best try even if the README's are not there. DO NOT ADD ANYTHING ELSE other than your response.
Currently written (add to this): ${textarea.value}\n
Both README's are below:
${readmeContents.join("\n")}`;

    // Example payload for the POST request
    const payload = {
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: promptContent,
        },
      ],
    };

    // POST request
    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (textarea) {
          textarea.value = data.choices[0].message.content;
          // TODO: dispatch change to trigger validation
        } else {
          console.error("Textarea not found!");
        }
      })
      .catch((error) => {
        console.error("Error during API call:", error);
        textarea.value += "Error during API call. Please try again.";
      });

    autoWriteButton.disabled = false;
  }

  // Initialize logic for Wonderdome
  function loopWaitForElement() {
    waitForElement(
      "textarea.w-full.p-4.border.border-gray-300.dark\\:border-gray-600.rounded-md.mb-4.text-gray-900.dark\\:text-white.bg-white.dark\\:bg-gray-700.min-h-\\[150px\\]",
      (element) => {
        textarea = element;
      }
    );
    waitForElement("#voting-reason-container-parent", (element) => {
      addButtonToVotingReasonContainer(element);
      // Wait for element to disappear only after first callback completes
      waitForElement(
        "#voting-reason-container-parent",
        (element) => {
          loopWaitForElement(element);
        },
        false
      );
    });
  }

  // Add keyboard shortcut for submitting
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "Enter") {
      if (document.activeElement === textarea) {
        document.getElementById("submit-vote").click();
      }
    }
  });

  loopWaitForElement();
})();

(function () {
    const observer = new MutationObserver((mutationsList, observer) => {
      const targetDiv = document.querySelector(".w-fit.mx-auto.mb-0.mt-3");
  
      if (targetDiv) {
        // Create the div element
        const newDiv = document.createElement("div");
        newDiv.className = "w-fit mx-auto mb-0 mt-3";
        newDiv.style.transform = "none";
  
        // Create and configure the button
        const button = document.createElement("button");
        button.className =
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition duration-150 active:scale-90 bg-[#9AD9EE] h-10 px-4 py-2 text-xl text-white bg-blend-color-burn";
        button.style = "background: rgb(210, 54, 226);";
        button.innerText = "Doubloon Calculator";
  
        button.onclick = function () {
          const elements = document.getElementsByClassName("flex-grow");
          const projects = Array.from(elements).map((element) =>
            element.innerText.trim().split("\n")
          );
          const processedProjects = projects.map((project) => {
            const name = project[0];
            const floatVal = parseFloat(project[1].split(" ")[0]);
            const intVal = parseInt(project[2].split(" ")[0], 10);
            return [name, floatVal, intVal];
          });
  
          const query = processedProjects
            .map((project) => project.map(encodeURIComponent).join(","))
            .join(";");
  
          const url = `https://doubloon-project-ranker.vercel.app/?data=${query}`;
          window.open(url, "_blank");
        };
  
        newDiv.appendChild(button);
        targetDiv.parentNode.insertBefore(newDiv, targetDiv.parentNode.children[2]); // After the second button
  
        observer.disconnect(); // Remove observer after done
      }
    });
  
    // Start observing for changes in the DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  })();
  
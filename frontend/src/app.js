import { fetchCats } from "./Feeder.js";
import { fetchOldCats } from "./OldCats.js";
import { renderChart } from "./statistics.js";

function navigateTo(path) {
  window.history.pushState({}, path, window.location.origin + path);
}

async function renderContent(path) {
  const contentDiv = document.getElementById("content");
  if (path === "/statistiken") {
    contentDiv.innerHTML = "";
    renderChart();
  } else {
    contentDiv.innerHTML = "";
    await fetchCats();
    await fetchOldCats();

    let catsDiv = document.getElementById("cats");
    const container = document.createElement("div");
    container.id = "missCats";
    container.classList.add("col-md-4", "mb-4");

    const card = document.createElement("div");
    card.id = "missCatsCard";
    card.classList.add("card", "text-white", "bg-dark", "h-100");

    // tmp till leo is found...
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    const cardText = document.createElement("h1");
    cardText.classList.add("card-text");
    cardText.textContent = `Miss you Leo :( <3`;
    cardBody.append(cardText);
    card.append(cardBody);
    container.append(card);
    catsDiv.append(container);
  }
}

window.navigateTo = navigateTo;
window.renderContent = renderContent;

window.onpopstate = () => {
  renderContent(window.location.pathname);
};

// Initiale Content-Anzeige beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
  renderContent(window.location.pathname);

  const notifyBtn = document.getElementById("notifyBtn");
  if (notifyBtn) {
    notifyBtn.addEventListener("click", () => {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("KODZE!", {
            body: "Kodzt!",
          });
        }
      });
    });
  }
});

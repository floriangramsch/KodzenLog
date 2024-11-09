import { fetchCats } from "./Feeder.js";
import { fetchOldCats } from "./OldCats.js";
import { renderChart } from "./statistics.js";

function navigateTo(path) {
  window.history.pushState({}, path, window.location.origin + path);
}

function renderContent(path) {
  const contentDiv = document.getElementById("content");
  if (path === "/statistiken") {
    contentDiv.innerHTML = "";
    renderChart();
  } else {
    contentDiv.innerHTML = "";
    fetchCats();
    fetchOldCats();
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

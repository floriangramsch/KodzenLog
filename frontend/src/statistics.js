import { formatDateTime } from "./Helper.js";

const fetchAll = () => {
  fetch("/api/ate")
    .then((response) => response.json())
    .then((data) => {
      const content = document.getElementById("content");
      // Leere den Inhalt, bevor du neue Daten hinzufügst
      content.innerHTML = "";

      // Erstelle ein Container für das Grid
      const ateContainer = document.createElement("div");
      ateContainer.classList.add("container", "mt-4");

      // Erstelle eine Zeile für das Grid
      const row = document.createElement("div");
      row.classList.add("row", "g-3");

      // Optionales Debugging
      const debug = false;
      data.slice(0, debug ? 10 : data.length).forEach((item) => {
        const col = document.createElement("div");
        col.classList.add("col-md-4", "col-lg-3", "col-xl-2");

        // Erstelle eine Karte für jeden Eintrag
        const card = document.createElement("div");
        card.classList.add("card", "bg-dark", "text-light", "h-100");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = item.cat_name;

        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = formatDateTime(new Date(item.time));

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        card.appendChild(cardBody);
        col.appendChild(card);
        row.appendChild(col);
      });

      ateContainer.appendChild(row);
      content.appendChild(ateContainer);
    });
};

const fetchOne = () => {};

export const renderChart = () => {
  const canvas_Wrapper = document.createElement("div");
  const canvas_feedings = document.createElement("canvas");
  const canvas_times = document.createElement("canvas");

  fetch("/api/ate")
    .then((response) => response.json())
    .then((data) => {
      let count_leo = 0;
      let count_naseweis = 0;
      let count_lucy = 0;
      data.forEach((e) => {
        switch (e.cat_name) {
          case "Naseweis":
            count_naseweis += 1;
            break;
          case "Leo":
            count_leo += 1;
            break;
          case "Lucy":
            count_lucy += 1;
            break;

          default:
            break;
        }
      });
      new Chart(canvas_feedings, {
        type: "bar",
        data: {
          labels: ["Naseweis", "Leo", "Lucy"],
          datasets: [
            {
              label: "# der Fuetterungen",
              data: [count_leo, count_naseweis, count_lucy],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      const hourlyData = Array.from({ length: 24 }, (_, hour) => {
        const count = data.filter((e) => new Date(e.time).getHours()-1 === hour).length;
        return count;
      });

      new Chart(canvas_times, {
        type: "line",
        data: {
          labels: Array.from({ length: 24 }, (_, hour) => `${hour}:00`),
          datasets: [
            {
              label: "Fuetterungszeiten",
              data: hourlyData,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

    });

  canvas_Wrapper.appendChild(canvas_feedings);
  canvas_Wrapper.appendChild(canvas_times);
  const content = document.getElementById("content");
  content.appendChild(canvas_Wrapper);
};

export { fetchAll, fetchOne };

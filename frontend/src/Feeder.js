import { formatDate } from "./Helper.js";

const createCatDiv = (cat) => {
  const catsDiv = document.getElementById("cats");
  const container = document.createElement("div");
  container.id = cat.id;
  container.classList.add("col-md-4", "mb-4");

  const card = document.createElement("div");
  card.id = "card" + cat.id;
  card.classList.add("card", "text-white", "bg-dark", "h-100");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const name = document.createElement("h5");
  name.classList.add("card-title");
  name.textContent = cat.name;

  const birth = document.createElement("p");
  birth.classList.add("card-text");
  const time = formatDate(new Date(cat.birth));
  birth.textContent = `Geboren am: ${time}`;

  const adopted = document.createElement("p");
  adopted.classList.add("card-text");
  const adoptedTime = formatDate(new Date(cat.adopted));
  adopted.textContent = `Bekommen am: ${adoptedTime}`;

  const weight = document.createElement("p");
  weight.classList.add("card-text");
  weight.textContent = `Wiegt: ${cat.body_weight} kg`;

  const feed = document.createElement("button");
  feed.textContent = `Füttere ${cat.name}`;
  feed.classList.add(
    "btn",
    "btn-primary",
    "mt-2",
    "btn-light",
    "black-font-color"
  );
  feed.addEventListener("click", () => {
    feedCat(cat);
  });

  cardBody.appendChild(name);
  cardBody.appendChild(birth);
  cardBody.appendChild(adopted);
  cardBody.appendChild(weight);
  cardBody.appendChild(feed);

  card.appendChild(cardBody);
  container.appendChild(card);
  catsDiv.appendChild(container);
};

export const fetchCats = async () => {
  try {
    const response = await fetch("/api/cats", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }

    const data = await response.json();
    let catsDiv = document.getElementById("cats");
    if (!catsDiv) {
      const content = document.getElementById("content");
      catsDiv = document.createElement("div");
      catsDiv.id = "cats";
      catsDiv.classList.add("row");
      const header = document.createElement("h1");
      header.classList.add("text-center", "mb-4");
      header.textContent = "Kodzies";
      content.appendChild(header);
      content.appendChild(catsDiv);
    }
    catsDiv.innerHTML = "";
    data.forEach((cat) => {
      createCatDiv(cat);
      ateToday(cat);
    });
  } catch (error) {
    console.error("Fetch-Fehler:", error);
  }
};

const uneat = async (ate_id, cat) => {
  const response = await fetch(`/api/uneat/${ate_id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    ateToday(cat);
    console.log("Kodze gegodzt!");
  } else {
    console.error("Failed to delete ate record.");
  }
};

const ateToday = async (cat) => {
  try {
    const response = await fetch(`/api/ate/today/${cat.name}`);
    const ate = await response.json();

    let ateContainer = document.getElementById("ate" + cat.id);
    if (!ateContainer) {
      ateContainer = document.createElement("div");
      ateContainer.id = "ate" + cat.id;
      ateContainer.classList.add("list-group", "mt-2");
    } else {
      ateContainer.innerHTML = "";
    }

    ate.forEach((e) => {
      const ateDiv = document.createElement("li");
      ateDiv.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "text-white",
        "bg-dark"
      );
      ateDiv.style.borderColor = "#212529";
      let newTime = new Date(e.time.replace("Z", "")).toLocaleString("de-De", {
        timeZone: "Europe/Berlin",
      });
      ateDiv.textContent =
        newTime.split(",")[1].split(":").slice(0, 2).join(":") + " Uhr";

      const button = document.createElement("button");
      button.textContent = `X`;
      // const icon = document.createElement("i");
      // icon.classList.add("fas", "fa-times");
      // button.appendChild(icon);
      button.classList.add("btn", "btn-danger", "btn-sm");
      button.addEventListener("click", () => {
        uneat(e.id, cat);
      });

      ateDiv.appendChild(button);
      ateContainer.appendChild(ateDiv);
    });

    const catsDiv = document.getElementById("card" + cat.id);
    catsDiv.appendChild(ateContainer);
  } catch (error) {
    console.error("AteToday-Fehler:", error);
  }
};

const feedCat = async (cat) => {
  try {
    const response = await fetch("/api/feed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cat: cat.name }),
    });
    if (response.ok) {
      ateToday(cat);
      ``;
      console.log("Katze erfolgreich gefüttert!");
    } else {
      throw new Error("Fehler beim Füttern der Katze.");
    }
  } catch (error) {
    console.error("FeedCat-Fehler:", error);
  }
};

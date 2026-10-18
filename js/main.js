"use strict";

/* KN STUDIO — RANDOM FACTS */
(function initRandomFacts() {
  const root = document.getElementById("random-facts");
  if (!root) return;

  const ui = {
    image: document.getElementById("featured-image"),
    category: document.getElementById("featured-category"),
    number: document.getElementById("featured-number"),
    title: document.getElementById("featured-title"),
    description: document.getElementById("featured-description"),
    source: document.getElementById("featured-source"),
    list: document.getElementById("fact-list"),
    refresh: document.getElementById("refresh-facts")
  };

  if (Object.values(ui).some((element) => !element)) {
    console.warn("KN Studio: Random Facts markup is incomplete.");
    return;
  }

  const facts = [
    {
      id: 1, category: "ANIMALS", title: "Octopuses have three hearts.",
      description: "Two hearts pump blood to the gills, while the third pumps it to the rest of the body.",
      image: "https://images.unsplash.com/photo-1545670723-196ed0954986?auto=format&fit=crop&w=1200&q=85",
      alt: "Octopus underwater", source: "https://unsplash.com/s/photos/octopus"
    },
    {
      id: 2, category: "SPACE", title: "A day on Venus is longer than its year.",
      description: "Venus takes about 243 Earth days to rotate once, but orbits the Sun in about 225 Earth days.",
      image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=85",
      alt: "Planet Venus in space", source: "https://unsplash.com/s/photos/venus-planet"
    },
    {
      id: 3, category: "WILDLIFE", title: "Flamingos aren't born pink.",
      description: "Pigments called carotenoids in their diet help give flamingos their pink colour as they mature.",
      image: "https://images.unsplash.com/photo-1497206365907-f5e630693df0?auto=format&fit=crop&w=1200&q=85",
      alt: "Flamingo in its habitat", source: "https://unsplash.com/s/photos/flamingo"
    },
    {
      id: 4, category: "OCEAN", title: "Blue whales are the largest known animals.",
      description: "Blue whales are the largest animals known to have lived on Earth, reaching around 30 metres in length.",
      image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=85",
      alt: "Whale in the ocean", source: "https://unsplash.com/s/photos/blue-whale"
    },
    {
      id: 5, category: "NATURE", title: "Honey resists spoilage for a very long time.",
      description: "Low water content and acidity help properly stored honey resist many microbes. Moisture contamination can still spoil it.",
      image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1200&q=85",
      alt: "Honey in a jar", source: "https://unsplash.com/s/photos/honey"
    },
    {
      id: 6, category: "SPACE", title: "The Moon is slowly moving away from Earth.",
      description: "The Moon recedes from Earth at an average rate of about 3.8 centimetres per year.",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=85",
      alt: "Earth and space", source: "https://unsplash.com/s/photos/moon-space"
    },
    {
      id: 7, category: "WILDLIFE", title: "Wombats produce cube-shaped droppings.",
      description: "The unusual shape forms because different sections of a wombat's intestine have different elasticity.",
      image: "https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?auto=format&fit=crop&w=1200&q=85",
      alt: "Wildlife in nature", source: "https://unsplash.com/s/photos/wombat"
    },
    {
      id: 8, category: "ASTRONOMY", title: "Saturn has a spectacular ring system.",
      description: "Saturn's rings contain countless particles, most of them made of water ice mixed with rocky material and dust.",
      image: "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?auto=format&fit=crop&w=1200&q=85",
      alt: "Saturn and its rings", source: "https://unsplash.com/s/photos/saturn"
    },
    {
      id: 9, category: "WEATHER", title: "Lightning can be hotter than the Sun's surface.",
      description: "Air inside a lightning channel can briefly reach around 30,000 kelvin.",
      image: "https://images.unsplash.com/photo-1429552077091-836152271555?auto=format&fit=crop&w=1200&q=85",
      alt: "Lightning in a storm", source: "https://unsplash.com/s/photos/lightning"
    },
    {
      id: 10, category: "BOTANY", title: "Some giant flowers smell like rotting meat.",
      description: "The titan arum produces a strong odour that attracts insects involved in pollination.",
      image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
      alt: "Flowers in bloom", source: "https://unsplash.com/s/photos/flowers"
    }
  ];

  let lastSelection = "";

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function chooseFive() {
    let chosen = shuffle(facts).slice(0, 5);
    let key = chosen.map((fact) => fact.id).sort((a, b) => a - b).join("-");
    let attempts = 0;
    while (key === lastSelection && attempts < 5) {
      chosen = shuffle(facts).slice(0, 5);
      key = chosen.map((fact) => fact.id).sort((a, b) => a - b).join("-");
      attempts++;
    }
    lastSelection = key;
    return chosen;
  }

  function setImage(image, fact) {
    image.src = fact.image;
    image.alt = fact.alt;
    image.loading = "lazy";
    image.onerror = () => {
      image.onerror = null;
      image.classList.add("image-unavailable");
      image.removeAttribute("src");
      image.alt = `${fact.alt} (image unavailable)`;
    };
  }

  function showFeatured(fact) {
    setImage(ui.image, fact);
    ui.category.textContent = fact.category;
    ui.number.textContent = `${String(fact.id).padStart(2, "0")} / 05`;
    ui.title.textContent = fact.title;
    ui.description.textContent = fact.description;
    ui.source.href = fact.source;
    ui.source.target = "_blank";
    ui.source.rel = "noopener noreferrer";
    ui.source.textContent = "Explore the photograph ↗";

    ui.list.querySelectorAll(".fact-preview").forEach((button) => {
      const active = Number(button.dataset.factId) === fact.id;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function createPreview(fact) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "fact-preview";
    button.dataset.factId = String(fact.id);
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `View discovery: ${fact.title}`);

    const image = document.createElement("img");
    setImage(image, fact);

    const copy = document.createElement("span");
    copy.className = "fact-preview-copy";

    const category = document.createElement("span");
    category.className = "fact-preview-category";
    category.textContent = fact.category;

    const title = document.createElement("span");
    title.className = "fact-preview-title";
    title.textContent = fact.title;

    const hint = document.createElement("span");
    hint.className = "fact-preview-hint";
    hint.textContent = "View discovery ↗";

    copy.append(category, title, hint);
    button.append(image, copy);
    button.addEventListener("click", () => showFeatured(fact));
    return button;
  }

  function render() {
    const selection = chooseFive();
    ui.list.replaceChildren();
    selection.slice(1).forEach((fact) => ui.list.appendChild(createPreview(fact)));
    showFeatured(selection[0]);
  }

  ui.refresh.addEventListener("click", render);
  render();
})();

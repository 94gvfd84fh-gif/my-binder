let cards = JSON.parse(localStorage.getItem("cards")) || [];
let showFavoritesOnly = false;
let currentView = "grid";
let currentPage = 1;
const cardsPerPage = 9;

displayCards();

function addCard() {
  const imageInput = document.getElementById("cardImage");
  const imageFile = imageInput.files[0];

  if (!imageFile) {
    alert("Please upload a card image.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    const card = {
      name: document.getElementById("cardName").value,
      set: document.getElementById("setName").value,
      value: Number(document.getElementById("value").value),
      image: event.target.result,
      status: document.getElementById("status").value,
      favorite: false
    };

    cards.push(card);
    saveCards();
    displayCards();
    clearForm();
  };

  reader.readAsDataURL(imageFile);
}

function saveCards() {
  localStorage.setItem("cards", JSON.stringify(cards));
}

function clearForm() {
  document.getElementById("cardName").value = "";
  document.getElementById("setName").value = "";
  document.getElementById("value").value = "";
  document.getElementById("cardImage").value = "";
  document.getElementById("status").value = "Keep";
}

function getFilteredCards() {
  const search = document.getElementById("searchInput").value.toLowerCase();

  return cards.filter(function(card) {
    const matchesSearch =
      card.name.toLowerCase().includes(search) ||
      card.set.toLowerCase().includes(search) ||
      card.status.toLowerCase().includes(search);

    const matchesFavorite =
      !showFavoritesOnly || card.favorite === true;

    return matchesSearch && matchesFavorite;
  });
}

function displayCards() {
  const cardList = document.getElementById("cardList");
  const binderControls = document.getElementById("binderControls");

  cardList.innerHTML = "";

  if (currentView === "binder") {
    cardList.classList.add("binder-view");
    binderControls.style.display = "block";
  } else {
    cardList.classList.remove("binder-view");
    binderControls.style.display = "none";
  }

  document.getElementById("gridViewBtn").classList.toggle("active", currentView === "grid");
  document.getElementById("binderViewBtn").classList.toggle("active", currentView === "binder");

  let filteredCards = getFilteredCards();

  if (currentView === "binder") {
    const totalPages = Math.max(1, Math.ceil(filteredCards.length / cardsPerPage));

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    filteredCards = filteredCards.slice(start, end);

    document.getElementById("pageNumber").textContent =
      "Page " + currentPage + " of " + totalPages;
  }

  filteredCards.forEach(function(card) {
    const realIndex = cards.indexOf(card);
    const star = card.favorite ? "★" : "☆";

    cardList.innerHTML += `
      <div class="card">
        <img src="${card.image}" alt="${card.name}">

        <button class="favorite" onclick="toggleCardFavorite(${realIndex})">
          ${star}
        </button>

        <h3>${card.name}</h3>
        <p><strong>Set:</strong> ${card.set}</p>
        <p><strong>Value:</strong> $${card.value}</p>
        <p><strong>Status:</strong> ${card.status}</p>

        <button onclick="editCard(${realIndex})">Edit</button>
        <button onclick="deleteCard(${realIndex})">Delete</button>
      </div>
    `;
  });

  if (currentView === "binder") {
    const emptySlots = cardsPerPage - filteredCards.length;

    for (let i = 0; i < emptySlots; i++) {
      cardList.innerHTML += `<div class="empty-pocket"></div>`;
    }
  }

  updateStats();
}

function updateStats() {
  const totalCards = cards.length;

  const totalValue = cards.reduce(function(total, card) {
    return total + card.value;
  }, 0);

  const tradeCards = cards.filter(function(card) {
    return card.status === "For Trade";
  }).length;

  const saleCards = cards.filter(function(card) {
    return card.status === "For Sale";
  }).length;

  document.getElementById("totalCards").textContent = totalCards;
  document.getElementById("totalValue").textContent = "$" + totalValue;
  document.getElementById("tradeCards").textContent = tradeCards;
  document.getElementById("saleCards").textContent = saleCards;
}

function sortCards() {
  const option = document.getElementById("sortOption").value;

  cards.sort(function(a, b) {
    if (option === "value") {
      return b.value - a.value;
    } else {
      return a[option].localeCompare(b[option]);
    }
  });

  currentPage = 1;
  saveCards();
  displayCards();
}

function deleteCard(index) {
  cards.splice(index, 1);
  saveCards();
  displayCards();
}

function editCard(index) {
  const newName = prompt("Enter new card name:", cards[index].name);
  const newSet = prompt("Enter new set name:", cards[index].set);
  const newValue = prompt("Enter new estimated value:", cards[index].value);
  const newStatus = prompt("Enter new status: Keep, For Trade, or For Sale", cards[index].status);

  cards[index].name = newName;
  cards[index].set = newSet;
  cards[index].value = Number(newValue);
  cards[index].status = newStatus;

  saveCards();
  displayCards();
}

function toggleCardFavorite(index) {
  cards[index].favorite = !cards[index].favorite;
  saveCards();
  displayCards();
}

function toggleFavorites() {
  showFavoritesOnly = !showFavoritesOnly;
  currentPage = 1;

  const button = document.getElementById("favoriteFilterBtn");

  if (showFavoritesOnly) {
    button.textContent = "Show All Cards";
    button.classList.add("active");
  } else {
    button.textContent = "Show Favorites Only";
    button.classList.remove("active");
  }

  displayCards();
}

function setView(view) {
  currentView = view;
  currentPage = 1;
  displayCards();
}

function nextPage() {
  const totalPages = Math.max(1, Math.ceil(getFilteredCards().length / cardsPerPage));

  if (currentPage < totalPages) {
    currentPage++;
    displayCards();
  }
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    displayCards();
  }
}
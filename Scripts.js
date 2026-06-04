// script.js - Core Logic Engine for ZENO MODS STORE Home Environment
document.addEventListener("DOMContentLoaded", () => {
  // UI Cache Hooks Element Selectors
  const featuredContainer = document.getElementById("featuredContainer");
  const latestContainer = document.getElementById("latestContainer");
  const trendingContainer = document.getElementById("trendingContainer");
  const searchInput = document.getElementById("searchInput");
  const categorySlider = document.getElementById("categorySlider");
  const dynamicContent = document.getElementById("dynamicContent");
  const extraPages = document.getElementById("extraPages");
  const navItems = document.querySelectorAll(".nav-item");

  let activeCategory = "All";

  // Render initialization processes
  initStore();

  function initStore() {
    renderFeatured();
    renderGroupedMods();
    setupSearch();
    setupCategories();
    setupNavigation();
  }

  // Inject high performing featured item setup
  function renderFeatured() {
    if(!featuredContainer) return;
    const featuredMod = modsData[0]; // Logic handles first item explicitly as primary focus banner
    if (!featuredMod) return;

    featuredContainer.innerHTML = `
      <div class="featured-card" onclick="openModDetails(${featuredMod.id})">
        <div class="featured-info">
          <h2>${featuredMod.title}</h2>
          <p><i class="fa-solid fa-fire"></i> Hot Choice - ${featuredMod.size}</p>
        </div>
      </div>
    `;
  }

  // Build regular structural lists setup
  function renderGroupedMods(filteredList = modsData) {
    if(!latestContainer || !trendingContainer) return;

    // Reset components safely
    latestContainer.innerHTML = "";
    trendingContainer.innerHTML = "";

    if (filteredList.length === 0) {
      latestContainer.innerHTML = `<p class="no-data">No mods matching your query found.</p>`;
      return;
    }

    // Latest Items Order Sort (By Release Date)
    const latestSorted = [...filteredList].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    latestSorted.forEach(mod => {
      latestContainer.appendChild(createModCard(mod));
    });

    // Trending Items Order Sort (By Downloads volume metrics)
    const trendingSorted = [...filteredList].sort((a, b) => b.downloads - a.downloads);
    trendingSorted.forEach(mod => {
      trendingContainer.appendChild(createModCard(mod));
    });
  }

  // Micro layout builder card generator standard component design template
  function createModCard(mod) {
    const card = document.createElement("div");
    card.className = "mod-card";
    card.onclick = () => openModDetails(mod.id);
    card.innerHTML = `
      <img src="${mod.image}" alt="${mod.title}" class="card-img" loading="lazy">
      <div class="card-title">${mod.title}</div>
      <div class="card-meta">
        <span class="meta-tag">${mod.category}</span>
        <span><i class="fa-solid fa-down-long"></i> ${mod.downloads}</span>
      </div>
    `;
    return card;
  }

  // Core instant response search algorithmic filters
  function setupSearch() {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      filterStore(term, activeCategory);
    });
  }

  // Slider Category Chip Interceptors Selection Actions Matrix
  function setupCategories() {
    categorySlider.addEventListener("click", (e) => {
      const targetChip = e.target.closest(".chip");
      if (!targetChip) return;

      document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      targetChip.classList.add("active");

      activeCategory = targetChip.getAttribute("data-category");
      filterStore(searchInput.value.toLowerCase().trim(), activeCategory);
    });
  }

  function filterStore(searchTerm, category) {
    // If exploring extra views, snap back to standard home feed seamlessly
    switchViewMode("home");

    const results = modsData.filter(mod => {
      const matchesSearch = mod.title.toLowerCase().includes(searchTerm) || mod.description.toLowerCase().includes(searchTerm);
      const matchesCategory = (category === "All") || (mod.category === category);
      return matchesSearch && matchesCategory;
    });

    // Toggle showcase panel dynamically to maintain clean UI formatting maps
    const featuredSection = document.getElementById("featuredSection");
    if(searchTerm !== "" || category !== "All") {
      if(featuredSection) featuredSection.classList.add("hidden");
    } else {
      if(featuredSection) featuredSection.classList.remove("hidden");
    }

    renderGroupedMods(results);
  }

  // Global scope bridge helper passing identifiers to detailed query parameters
  window.openModDetails = function(id) {
    window.location.href = `app.html?id=${id}`;
  };

  // Switch display environments seamlessly
  function switchViewMode(target) {
    if (target === "home") {
      dynamicContent.classList.remove("hidden");
      extraPages.classList.add("hidden");
      document.querySelectorAll(".chip").forEach(c => {
        if(c.getAttribute('data-category') === activeCategory) c.classList.add('active');
      });
    } else {
      dynamicContent.classList.add("hidden");
      extraPages.classList.remove("hidden");
    }
    
    // Highlight matching bottom tab index item explicitly
    navItems.forEach(btn => {
      if(btn.getAttribute("data-target") === target) btn.classList.add("active");
      else btn.classList.remove("active");
    });
  }

  // App Shell Navigation Structure Mapping
  function setupNavigation() {
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        const target = item.getAttribute("data-target");
        
        navItems.forEach(btn => btn.classList.remove("active"));
        item.classList.add("active");

        if (target === "home") {
          switchViewMode("home");
        } else {
          switchViewMode(target);
          renderExtraPage(target);
        }
      });
    });
  }

  // Injects structural hardcoded content on-the-fly dynamically
  function renderExtraPage(target) {
    if(target === "guide") {
      extraPages.innerHTML = `
        <div class="info-page-container">
          <div class="info-card">
            <h2><i class="fa-solid fa-book-open"></i> Android Mod Installation Guide</h2>
            <p><strong>Step 1:</strong> Download the required custom files (Roster/Court/Cyberface) from this store.</p>
            <p><strong>Step 2:</strong> Download and install <strong>ZArchiver</strong> from the Play Store to extract compression files.</p>
            <p><strong>Step 3:</strong> Locate your downloaded files, extract them, and copy the folders or `.iff` contents into your game directory path:</p>
            <p style="background:rgba(0,0,0,0.3); padding:8px; border-radius:4px; font-family:monospace; font-size:0.8rem; word-break:break-all;">
              /Android/data/com.t2ksports.nba2k20and/files/
            </p>
            <p><strong>Step 4:</strong> Launch NBA 2K20, go to Options -> Load/Save -> and load the designated ZENO Roster map file.</p>
          </div>
        </div>
      `;
    } else if (target === "faq") {
      extraPages.innerHTML = `
        <div class="info-page-container">
          <div class="info-card">
            <h2>Game Force Closes on Startup?</h2>
            <p>This occurs when your device runs low on RAM while initializing heavy 4K cyberfaces or texture updates. Try lowering graphics sliders in game settings or clearing background background apps.</p>
          </div>
          <div class="info-card">
            <h2>How often are Rosters updated?</h2>
            <p>Rosters are managed by ZENO MODS instantly following significant real-life trades, draft adjustments, and jersey uniform re-designs during active seasons.</p>
          </div>
        </div>
      `;
    } else if (target === "about") {
      extraPages.innerHTML = `
        <div class="info-page-container">
          <div class="info-card">
            <h2>About ZENO MODS</h2>
            <p>Welcome to the premium distribution hub for advanced Android NBA 2K20 transformations. Developed independently to deliver modern rosters, courts, realistic scoreboard HUD shifts, and detailed player face-scans directly to players worldwide.</p>
            <p>Follow my primary digital broadcast operations pipelines via standard social loops:</p>
            <div class="social-grid">
              <a href="#" class="social-link yt"><i class="fa-brands fa-youtube"></i> YouTube</a>
              <a href="#" class="social-link fb"><i class="fa-brands fa-facebook"></i> Facebook</a>
              <a href="#" class="social-link dc"><i class="fa-brands fa-discord"></i> Discord</a>
            </div>
          </div>
        </div>
      `;
    }
  }
});

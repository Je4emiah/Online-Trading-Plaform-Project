/**
 * ==========================================================================
 * TRADY — INTERACTION DATA STREAM LOGIC ARCHITECTURE
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // Structural Node Targets
    const modal          = document.getElementById("dealModal");
    const closeModal     = document.querySelector(".close-modal");
    const messageBox     = document.getElementById("messageBox");
    const toast          = document.getElementById("toast");
    const searchInput    = document.getElementById("searchInput");
    const clearSearch    = document.getElementById("clearSearch");
    const searchMeta     = document.getElementById("searchMeta");
    const wtsGrid        = document.getElementById("wtsGrid");
    const wtbGrid        = document.getElementById("wtbGrid");
    const wtsEmpty       = document.getElementById("wtsEmpty");
    const wtbEmpty       = document.getElementById("wtbEmpty");
    const noResults      = document.getElementById("noResults");
    const noResultsQuery = document.getElementById("noResultsQuery");
    const wtsBadge       = document.getElementById("wtsBadge");
    const wtbBadge       = document.getElementById("wtbBadge");
    const heroWts        = document.getElementById("wtsCount");
    const heroWtb        = document.getElementById("wtbCount");

    let activePhone   = "";
    let activeTgUser  = "";
    let activeEmail   = "";
    let searchOpen    = false;

    // --- 1. MODAL ENGINE PIPELINE CONTROL OVERLAYS ---
    function openModalForCard(card) {
        const itemTitle = card.querySelector(".item-title")?.textContent || "Item";
        const price     = card.querySelector(".price-tag")?.textContent || "N/A";
        const typeLabel = card.querySelector(".deal-type")?.textContent || "DEAL";
        const username  = card.dataset.username || "User";

        activePhone   = card.dataset.phone    || "";
        activeTgUser  = card.dataset.telegram || "";
        activeEmail   = card.dataset.email    || "";

        document.getElementById("modalTitle").textContent = `Link With ${username}`;
        messageBox.textContent = `Hello, I saw your listing for "${itemTitle}" priced at ${price} on Trady and would like to arrange the trade transaction.`;

        // Configure platform links dynamically
        setupChannelLink("link-whatsapp", activePhone, `https://wa.me/${activePhone.replace(/\+/g, '')}?text=${encodeURIComponent(messageBox.textContent)}`);
        setupChannelLink("link-telegram", activeTgUser, `https://t.me/${activeTgUser.replace(/@/g, '')}`);
        setupChannelLink("link-line", card.dataset.line, `https://line.me/ti/p/~${card.dataset.line}`);
        setupChannelLink("link-sms", activePhone, `sms:${activePhone};?&body=${encodeURIComponent(messageBox.textContent)}`);
        setupChannelLink("link-email", activeEmail, `mailto:${activeEmail}?subject=${encodeURIComponent("Trady Marketplace Inquiry")}&body=${encodeURIComponent(messageBox.textContent)}`);
        setupChannelLink("link-messenger", card.dataset.fb, `https://m.me/${card.dataset.fb}`);

        setupCopyAction("btn-discord", card.dataset.discord, "Discord handle copied");
        setupCopyAction("btn-wechat", card.dataset.wechat, "WeChat identity signature copied");

        modal.classList.add("active");
    }

    function setupChannelLink(id, value, url) {
        const el = document.getElementById(id);
        if (!el) return;
        if (value && value.trim() !== "") {
            el.setAttribute("href", url);
            el.classList.remove("hidden-element");
        } else {
            el.classList.add("hidden-element");
        }
    }

    function setupCopyAction(id, value, successMsg) {
        const el = document.getElementById(id);
        if (!el) return;
        if (value && value.trim() !== "") {
            el.classList.remove("hidden-element");
            // Wipe clean old listeners to clear event bubble queues
            const freshEl = el.cloneNode(true);
            el.parentNode.replaceChild(freshEl, el);
            freshEl.addEventListener("click", () => {
                navigator.clipboard.writeText(value)
                    .then(() => triggerToast(successMsg))
                    .catch(() => triggerToast("Copy routine failed."));
            });
        } else {
            el.classList.add("hidden-element");
        }
    }

    if (closeModal) {
        closeModal.addEventListener("click", () => modal.classList.remove("active"));
    }
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });

    // --- 2. LIVE SEAMLESS TOAST ENGINE ---
    function triggerToast(message) {
        toast.textContent = message;
        toast.classList.add("active");
        setTimeout(() => toast.classList.remove("active"), 3000);
    }

    // --- 3. DYNAMIC SEARCH & RADIAL LOGIC ENGINE ---
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase().trim();
            clearSearch.style.display = query.length > 0 ? "block" : "none";

            const cards = document.querySelectorAll(".deal-card");
            let visibleWTS = 0, visibleWTB = 0;

            cards.forEach(card => {
                const title   = card.querySelector(".item-title")?.textContent.toLowerCase() || "";
                const details = card.querySelector(".item-details")?.textContent.toLowerCase() || "";
                const user    = card.dataset.username?.toLowerCase() || "";
                const type    = card.dataset.type || "";

                const matches = title.includes(query) || details.includes(query) || user.includes(query);

                if (matches) {
                    card.classList.remove("hidden-element");
                    if (type === "wts") visibleWTS++;
                    else if (type === "wtb") visibleWTB++;
                } else {
                    card.classList.add("hidden-element");
                }
            });

            // Handle column visibility toggles
            toggleEmptyState(wtsEmpty, wtsGrid, visibleWTS);
            toggleEmptyState(wtbEmpty, wtbGrid, visibleWTB);

            // Handle global no-results panel visibility
            const absoluteTotal = visibleWTS + visibleWTB;
            if (absoluteTotal === 0 && query.length > 0) {
                noResults.classList.remove("hidden-element");
                noResultsQuery.textContent = `"${searchInput.value}"`;
            } else {
                noResults.classList.add("hidden-element");
            }

            // Sync structural count values cleanly
            updateBadgeCounters(visibleWTS, visibleWTB, query.length > 0);
        });

        clearSearch.addEventListener("click", () => {
            searchInput.value = "";
            clearSearch.style.display = "none";
            searchInput.dispatchEvent(new Event("input"));
            searchInput.focus();
        });
    }

    function toggleEmptyState(emptyEl, gridEl, count) {
        if (count === 0) {
            emptyEl.classList.remove("hidden-element");
            gridEl.style.display = "none";
        } else {
            emptyEl.classList.add("hidden-element");
            gridEl.style.display = "flex";
        }
    }

    function updateBadgeCounters(wts, wtb, isSearching) {
        wtsBadge.textContent = `${wts} item${wts === 1 ? '' : 's'}`;
        wtbBadge.textContent = `${wtb} item${wtb === 1 ? '' : 's'}`;
        if (isSearching) {
            searchMeta.style.display = "block";
            searchMeta.textContent = `⚡ Search filter active: ${wts + wtb} metrics correlated.`;
        } else {
            searchMeta.style.display = "none";
        }
    }

    // --- 4. DATA LOADER RUNTIME LOOP ---
    function initializeMarketplaceDataset() {
        const mockedDataset = [
            { type: "wts", item: "Premium Damascus Steel Sword", price: "$1,450", username: "ViperBlade", details: "Forged with 1095 and 15N20 high carbon core steel layers. Perfect edge telemetry alignment. Collectors condition.", phone: "+15550199", telegram: "@viperblade", email: "viper@trady.io", line: "viper.blade", discord: "Viper#9991", wechat: "wx_viper", fb: "viper.listings" },
            { type: "wts", item: "Cyberpunk Oni Hannya Mask", price: "$280", username: "NeonShogun", details: "Custom printed resin structure complete with integrated glowing cyan micro-LED lines. Interior cushioned padding matrix.", phone: "+81900111", telegram: "@neonshogun", email: "shogun@neon.net", line: "", discord: "Shogun#1102", wechat: "", fb: "neon.shogun" },
            { type: "wtb", item: "Vintage Leica M6 Camera Base", price: "Offer ~$3,200", username: "SilverHalide", details: "Seeking functional internal mechanical shutter states. Minor cosmetic leather peeling accepted. Drop direct telemetry channels.", phone: "", telegram: "@silverhalide", email: "halide@capture.org", line: "halide.leica", discord: "", wechat: "leica_silver", fb: "" },
            { type: "wtb", item: "Audeze LCD-4 Planar Headphones", price: "Budget $2,100", username: "AudiophileX", details: "Must include original wooden structural box housing array and XLR balance wiring harness system. 200 ohm variant targets.", phone: "+14159988", telegram: "", email: "sound@audiophile.me", line: "", discord: "Audio#4401", wechat: "", fb: "audiophile.exchange" }
        ];

        let totalWTS = 0, totalWTB = 0;

        mockedDataset.forEach(data => {
            const card = document.createElement("div");
            card.className = "deal-card";
            card.dataset.type = data.type;
            card.dataset.username = data.username;
            card.dataset.phone = data.phone;
            card.dataset.telegram = data.telegram;
            card.dataset.line = data.line;
            card.dataset.email = data.email;
            card.dataset.discord = data.discord;
            card.dataset.wechat = data.wechat;
            card.dataset.fb = data.fb;

            const typeLabel = data.type === "wts" ? "WTS • Sell" : "WTB • Buy";
            const typeClass = data.type === "wts" ? "type-wts" : "type-wtb";

            card.innerHTML = `
                <div class="card-header">
                    <span class="deal-type ${typeClass}">${typeLabel}</span>
                    <span class="user-status"><i class="fa-solid fa-circle"></i> ${data.username}</span>
                </div>
                <div class="card-body">
                    <h3 class="item-title">${data.item}</h3>
                    <p class="item-details">${data.details}</p>
                    <div class="price-tag">${data.price}</div>
                </div>
                <div class="card-footer">
                    <span class="card-timestamp"><i class="fa-regular fa-clock"></i> Active</span>
                    <div class="card-actions">
                        <button class="btn btn-chat"><i class="fa-solid fa-comments"></i> Details</button>
                        <button class="btn btn-deal trigger-deal-modal">⚡ Connect</button>
                    </div>
                </div>`;

            card.querySelector(".trigger-deal-modal").addEventListener("click", () => openModalForCard(card));
            card.querySelector(".btn-chat").addEventListener("click", () => triggerToast(`Displaying audit logs for item entry: "${data.item}"`));

            if (data.type === "wts") {
                wtsGrid.appendChild(card);
                totalWTS++;
            } else {
                wtbGrid.appendChild(card);
                totalWTB++;
            }
        });

        // Initialize display counters on initial load
        heroWts.textContent = totalWTS;
        heroWtb.textContent = totalWTB;
        updateBadgeCounters(totalWTS, totalWTB, false);
    }

    // Fire data loading step
    initializeMarketplaceDataset();
})
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("dealModal");
    const closeModal = document.querySelector(".close-modal");
    const messageBox = document.getElementById("messageBox");
    const toast = document.getElementById("toast");

    // Global contact variables to maintain reference during live edits
    let activePhone = "";
    let activeTgUser = "";
    let activeEmail = "";

    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

    // Click handler for all Deal Trigger buttons
    document.querySelectorAll(".trigger-deal-modal").forEach(button => {
        button.addEventListener("click", (e) => {
            const card = e.target.closest(".deal-card");
            
            // Extract item variables from the card components
            const item = card.getAttribute("data-item");
            const price = card.getAttribute("data-price");
            
            // Define the baseline text constant with integrated variables
            const defaultMessage = `Hi! I want to buy your "${item}" for ${price} on Trady.`;
            
            // Put the default message directly inside our editable layout text box
            messageBox.value = defaultMessage;

            // Save contact details to global state for live updates
            activePhone = card.getAttribute("data-phone");
            activeTgUser = card.getAttribute("data-telegram");
            activeEmail = card.getAttribute("data-email");
            
            const lineId = card.getAttribute("data-line");
            const dcTag = card.getAttribute("data-discord");
            const wcId = card.getAttribute("data-wechat");
            const fbUser = card.getAttribute("data-fb");

            // Build Tier 1 hyperlinks immediately on first load
            updateLiveLinks(defaultMessage);

            // Configure non-pre-filled elements (Tier 2 actions)
            setupTier2Copy("btn-discord", dcTag, "https://discord.com", "📋 Discord Tag copied! Opening Discord...");
            setupTier2Copy("btn-wechat", wcId, "https://weixin.qq.com/", "📋 WeChat ID copied! Opening WeChat...");
            document.getElementById("link-messenger").href = `https://m.me/${fbUser}`;

            modal.style.display = "flex";
        });
    });

    // LISTEN FOR LIVE EDITS: Fires whenever user modifies the text area box
    messageBox.addEventListener("input", (e) => {
        const customMessage = e.target.value;
        updateLiveLinks(customMessage);
    });

    // Function to calculate link parameters using real-time message state
    function updateLiveLinks(currentText) {
        const encodedMsg = encodeURIComponent(currentText);

        document.getElementById("link-whatsapp").href = `https://wa.me/${activePhone}?text=${encodedMsg}`;
        document.getElementById("link-telegram").href = `https://t.me/${activeTgUser}?text=${encodedMsg}`;
        document.getElementById("link-line").href = `https://line.me/R/msg/text/?${encodedMsg}`;
        document.getElementById("link-sms").href = `sms:${activePhone}?&body=${encodedMsg}`;
        document.getElementById("link-email").href = `mailto:${activeEmail}?subject=Trady Purchase Offer&body=${encodedMsg}`;
    }

    // Helper to bind clipboard events to Tier 2 elements
    function setupTier2Copy(elementId, textToCopy, forwardUrl, successMsg) {
        const btn = document.getElementById(elementId);
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener("click", () => {
            if (!textToCopy) return alert("User hasn't provided this ID.");
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(successMsg);
                setTimeout(() => { window.open(forwardUrl, '_blank'); }, 1000);
            });
        });
    }

    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add("show");
        setTimeout(() => { toast.classList.remove("show"); }, 2500);
    }
});
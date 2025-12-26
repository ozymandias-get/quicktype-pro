/**
 * Tabs Module
 * Tab geçişleri yönetimi
 */

/**
 * Tab sistemini başlatır
 * @param {Object} elements - DOM elementleri
 * @param {Function} onTabChange - Tab değiştiğinde çalışacak callback
 */
export function initTabs(elements, onTabChange) {
    const { tabButtons, tabContents, input } = elements;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.dataset.target;
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetId) {
                    content.classList.add('active');

                    // Klavye sekmesine geçildiğinde input'a focus
                    if (targetId === 'view-keyboard' && input) {
                        setTimeout(() => input.focus(), 100);
                    }

                    // Callback çağır
                    if (onTabChange) {
                        onTabChange(targetId);
                    }
                }
            });
        });
    });
}

/**
 * Belirli bir tab'a geçiş yapar
 * @param {string} tabId - Geçilecek tab ID'si
 * @param {Object} elements - DOM elementleri
 */
export function switchToTab(tabId, elements) {
    const { tabButtons, tabContents } = elements;

    tabButtons.forEach(btn => {
        if (btn.dataset.target === tabId) {
            btn.click();
        }
    });
}

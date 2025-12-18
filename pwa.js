document.addEventListener('DOMContentLoaded', () => {
    const pwaStatus = document.getElementById('pwa-status');
    let deferredPrompt;
    let installButton;

    // REGISTER SERVICE WORKER
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js');
        });
    }

    // INSTALL PROMPT
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        if (installButton) return;

        installButton = document.createElement('button');
        installButton.innerHTML = '<i class="fas fa-download"></i> Install Aplikasi';
        installButton.className = 'download-btn install-button';
        installButton.style.display = 'block';
        installButton.style.margin = '10px auto';

        document.querySelector('footer')?.appendChild(installButton);

        installButton.onclick = async () => {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
            installButton.remove();
        };

        pwaStatus.textContent = '';
    });

    window.addEventListener('appinstalled', () => {
        installButton?.remove();
        pwaStatus.textContent = '';
    });
});

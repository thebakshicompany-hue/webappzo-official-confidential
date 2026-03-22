(function () {
    // URL of the deployed Netlify agent
    const AGENT_URL = "https://surajai.netlify.app/";

    // Create a container for the widget
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'suraj-agent-widget';

    // Style the container
    Object.assign(widgetContainer.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '380px',
        height: '600px',
        maxHeight: '80vh',
        maxWidth: '90vw',
        zIndex: '999999',
        display: 'none',
        flexDirection: 'column',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: '#0d1117',
        transition: 'all 0.3s ease',
        transform: 'translateY(20px)',
        opacity: '0'
    });

    // Create the iframe
    const iframe = document.createElement('iframe');
    iframe.src = AGENT_URL;
    Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        border: 'none',
        margin: '0',
        padding: '0'
    });

    // Add iframe to container
    widgetContainer.appendChild(iframe);

    // Create the floating action button (FAB)
    const fabButton = document.createElement('button');
    fabButton.id = 'suraj-agent-fab';
    fabButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';

    Object.assign(fabButton.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#58a6ff',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(88, 166, 255, 0.4)',
        border: 'none',
        zIndex: '1000000',
        transition: 'transform 0.2s ease, background-color 0.2s ease'
    });

    // Add hover effect
    fabButton.addEventListener('mouseover', () => {
        fabButton.style.transform = 'scale(1.05)';
        fabButton.style.backgroundColor = '#3182ce';
    });
    fabButton.addEventListener('mouseout', () => {
        fabButton.style.transform = 'scale(1)';
        fabButton.style.backgroundColor = '#58a6ff';
    });

    // Toggle widget logic
    let isOpen = false;
    fabButton.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            widgetContainer.style.display = 'flex';
            // Trigger reflow
            setTimeout(() => {
                widgetContainer.style.transform = 'translateY(0)';
                widgetContainer.style.opacity = '1';
                fabButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            }, 10);
        } else {
            widgetContainer.style.transform = 'translateY(20px)';
            widgetContainer.style.opacity = '0';
            setTimeout(() => {
                widgetContainer.style.display = 'none';
                fabButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
            }, 300);
        }
    });

    // Add elements to body
    document.body.appendChild(widgetContainer);
    document.body.appendChild(fabButton);

    // Responsive iframe mobile check
    function checkMobile() {
        if (window.innerWidth <= 480) {
            Object.assign(widgetContainer.style, {
                width: '100vw',
                height: '100vh',
                bottom: '0',
                right: '0',
                borderRadius: '0',
                maxHeight: '100vh'
            });
            // Adjust FAB to be inside or hide when open
            if (isOpen) fabButton.style.display = 'none';
        } else {
            Object.assign(widgetContainer.style, {
                width: '380px',
                height: '600px',
                bottom: '90px',
                right: '20px',
                borderRadius: '12px',
                maxHeight: '80vh'
            });
            fabButton.style.display = 'flex';
        }
    }

    window.addEventListener('resize', checkMobile);
    checkMobile(); // Check on init

})();

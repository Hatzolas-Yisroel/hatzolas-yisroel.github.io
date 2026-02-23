/**
 * Hatzolas Yisroel Web Chat Widget
 * Official Design Kit Applied
 */
(function () {
    // Inject Fonts
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Inject Styles
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --hatz-primary: #667999;
            --hatz-accent: #102241;
            --hatz-background: #FAFAFA;
            --hatz-surface: #ffffff;
            --hatz-text-main: #102241;
            --hatz-text-light: #667999;
            --hatz-border: #e2e8f0;
        }

        #hatz-chat-widget {
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            color: var(--hatz-text-main);
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            pointer-events: none;
        }
        
        #hatz-chat-widget * {
            box-sizing: border-box;
            pointer-events: auto;
        }

        #hatz-chat-window {
            width: 350px;
            height: 500px;
            max-height: calc(100vh - 100px);
            background: var(--hatz-surface);
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(16, 34, 65, 0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            margin-bottom: 16px;
            border: 1px solid var(--hatz-border);
        }

        #hatz-chat-window.hatz-open {
            opacity: 1;
            transform: translateY(0);
        }

        .hatz-chat-header {
            background-color: var(--hatz-accent);
            color: white;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .hatz-chat-header h3 {
            margin: 0;
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            font-weight: 700;
        }
        
        .hatz-chat-header p {
            margin: 4px 0 0 0;
            font-size: 12px;
            color: var(--hatz-primary);
        }

        .hatz-close-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
            opacity: 0.8;
            padding: 0;
        }
        
        .hatz-close-btn:hover {
            opacity: 1;
        }

        #hatz-chat-messages {
            flex-grow: 1;
            padding: 16px;
            overflow-y: auto;
            background-color: var(--hatz-background);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .hatz-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 8px;
            line-height: 1.4;
            word-wrap: break-word;
        }

        .hatz-msg-bot {
            background-color: white;
            border: 1px solid var(--hatz-border);
            color: var(--hatz-text-main);
            align-self: flex-start;
            border-bottom-left-radius: 2px;
        }

        .hatz-msg-user {
            background-color: var(--hatz-primary);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
        }

        .hatz-chat-input-area {
            padding: 16px;
            background: white;
            border-top: 1px solid var(--hatz-border);
            display: flex;
            gap: 8px;
        }

        #hatz-chat-input {
            flex-grow: 1;
            border: 1px solid var(--hatz-border);
            padding: 10px 14px;
            border-radius: 6px;
            font-family: inherit;
            font-size: 12px;
            outline: none;
            background: var(--hatz-background);
            color: var(--hatz-text-main);
        }
        
        #hatz-chat-input:focus {
            border-color: var(--hatz-primary);
        }

        #hatz-chat-send {
            background-color: var(--hatz-accent);
            color: white;
            border: none;
            padding: 0 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-family: inherit;
            transition: background 0.2s;
        }

        #hatz-chat-send:hover {
            background-color: #081121;
        }

        #hatz-chat-toggle {
            width: 56px;
            height: 56px;
            border-radius: 28px;
            background-color: var(--hatz-accent);
            color: white;
            border: none;
            box-shadow: 0 4px 12px rgba(16, 34, 65, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, background 0.2s;
        }

        #hatz-chat-toggle:hover {
            transform: scale(1.05);
            background-color: #081121;
        }
        
        .hatz-typing {
            align-self: flex-start;
            background-color: transparent;
            color: var(--hatz-text-light);
            font-style: italic;
            font-size: 11px;
            display: none;
            margin-top: -8px;
        }

        /* SVG Icons */
        .hatz-icon {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }
    `;
    document.head.appendChild(style);

    // Create DOM Elements
    const chatContainer = document.createElement('div');
    chatContainer.id = 'hatz-chat-widget';

    // N8N Webhook that receives chat messages
    // Wait, the user has n8n domain, I will create a path /webhook/web-chat later
    const WEBHOOK_URL = 'https://n8n.hatzolasyisroel.com/webhook/web-chat';

    chatContainer.innerHTML = `
        <div id="hatz-chat-window">
            <div class="hatz-chat-header">
                <div>
                    <h3>Asistente de Comunidad</h3>
                    <p>Hatzolas Yisroel</p>
                </div>
                <button class="hatz-close-btn">&times;</button>
            </div>
            <div id="hatz-chat-messages">
                <div class="hatz-msg hatz-msg-bot">¡Hola! Soy el asistente virtual de la comunidad Hatzolas Yisroel. ¿En qué te puedo ayudar hoy?</div>
            </div>
            <div class="hatz-typing" id="hatz-typing-indicator">El asistente está escribiendo...</div>
            <div class="hatz-chat-input-area">
                <input type="text" id="hatz-chat-input" placeholder="Escribe tu mensaje aquí..." autocomplete="off">
                <button id="hatz-chat-send">Enviar</button>
            </div>
        </div>
        <button id="hatz-chat-toggle" aria-label="Abrir chat">
            <svg class="hatz-icon" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
        </button>
    `;

    document.body.appendChild(chatContainer);

    // Logic
    let isOpen = false;
    const sessionId = 'hatz_' + Math.random().toString(36).substring(2, 15);
    const windowEl = document.getElementById('hatz-chat-window');
    const toggleBtn = document.getElementById('hatz-chat-toggle');
    const closeBtn = document.querySelector('.hatz-close-btn');
    const inputEl = document.getElementById('hatz-chat-input');
    const sendBtn = document.getElementById('hatz-chat-send');
    const messagesEl = document.getElementById('hatz-chat-messages');
    const typingIndicator = document.getElementById('hatz-typing-indicator');

    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            windowEl.style.display = 'flex';
            // slight delay to allow display block to render before opacity transition
            setTimeout(() => {
                windowEl.classList.add('hatz-open');
            }, 10);
        } else {
            windowEl.classList.remove('hatz-open');
            setTimeout(() => {
                if (!isOpen) windowEl.style.display = 'none';
            }, 300);
        }
    }

    // Initially hide without removing from DOM
    windowEl.style.display = 'none';

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    function addMessage(text, isUser) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'hatz-msg ' + (isUser ? 'hatz-msg-user' : 'hatz-msg-bot');
        msgDiv.textContent = text;
        messagesEl.appendChild(msgDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    async function sendMessage() {
        const text = inputEl.value.trim();
        if (!text) return;

        // Add user message
        addMessage(text, true);
        inputEl.value = '';
        inputEl.focus();

        // Show typing
        typingIndicator.style.display = 'block';

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: sessionId,
                    message: text,
                    source: 'web'
                })
            });

            const data = await response.json();
            typingIndicator.style.display = 'none';

            if (data && data.reply) {
                addMessage(data.reply, false);
            } else {
                addMessage("Mis disculpas, estamos experimentando un retraso en este momento. Por favor contacta directo por WhatsApp.", false);
            }
        } catch (error) {
            typingIndicator.style.display = 'none';
            console.error('Widget error:', error);
            addMessage("Error de conexión. Por favor intenta de nuevo.", false);
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

})();

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const sendBtn = document.getElementById('sendBtn');
    const newChatBtn = document.getElementById('newChatBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Conversation State for Serverless Backend
    let conversationHistory = [
        { "role": "system", "content": "You are SURAJ, a highly intelligent and helpful general-purpose assistant created by WebAppzo. You provide excellent formatting, professional tone, and comprehensive answers. You are powered by advanced AI." }
    ];

    // Auto-resize textarea
    userInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value.trim() === '') {
            sendBtn.disabled = true;
        } else {
            sendBtn.disabled = false;
        }
    });

    // Handle Enter key (Shift+Enter for new line)
    userInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.value.trim() !== '') {
                chatForm.dispatchEvent(new Event('submit'));
            }
        }
    });

    // Form submit
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const message = userInput.value.trim();
        if (!message) return;

        // Reset input
        userInput.value = '';
        userInput.style.height = 'auto';
        sendBtn.disabled = true;

        // Append user message to UI and history
        appendMessage('user', message);
        conversationHistory.push({ "role": "user", "content": message });

        // Append loading indicator
        const loadingId = appendLoading();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: conversationHistory })
            });

            // Remove loading indicator
            document.getElementById(loadingId).remove();

            if (response.ok) {
                const data = await response.json();
                appendMessage('assistant', data.response);
                conversationHistory.push({ "role": "assistant", "content": data.response });
            } else {
                let errorMsg = `Server Error (${response.status})`;
                try {
                    const data = await response.json();
                    errorMsg = data.error || errorMsg;
                } catch (e) {
                    errorMsg += " - HTML Response (Endpoint not found or Server Crash)";
                }
                appendMessage('assistant', `Error: ${errorMsg}`);
            }
        } catch (error) {
            if (document.getElementById(loadingId)) {
                document.getElementById(loadingId).remove();
            }
            appendMessage('assistant', `Network/Parse Error: ${error.message}`);
            console.error('Detailed Error:', error);
        }
    });

    // Reset Chat
    const resetChat = () => {
        // Reset local state
        conversationHistory = [
            { "role": "system", "content": "You are SURAJ, a highly intelligent and helpful general-purpose assistant created by WebAppzo. You provide excellent formatting, professional tone, and comprehensive answers. You are powered by advanced AI." }
        ];

        chatBox.innerHTML = `
            <div class="message assistant">
                    <div class="avatar"><i class="fa-solid fa-robot"></i></div>
                    <div class="bubble">
                        <p>Hello! I am SURAJ, your intelligent general assistant created by WebAppzo. How can I help you build something great today?</p>
                    </div>
                </div>
            `;
    };

    newChatBtn.addEventListener('click', resetChat);
    clearBtn.addEventListener('click', resetChat);

    // Helpers
    function appendMessage(role, content) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.innerHTML = role === 'assistant'
            ? '<i class="fa-solid fa-robot"></i>'
            : '<i class="fa-solid fa-user"></i>';

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bubble';

        // Simple line break parsing
        const p = document.createElement('p');
        p.innerHTML = content.replace(/\ng/g, '<br>');
        bubbleDiv.appendChild(p);

        msgDiv.appendChild(avatarDiv);
        msgDiv.appendChild(bubbleDiv);

        chatBox.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendLoading() {
        const id = 'loading-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message assistant';
        msgDiv.id = id;

        msgDiv.innerHTML = `
            <div class="avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="bubble">
                <div class="loading-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;

        chatBox.appendChild(msgDiv);
        scrollToBottom();
        return id;
    }

    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Initial setup
    sendBtn.disabled = true;
});

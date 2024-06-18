export function initChatbot() {
    function toggleChatbot() {
        const chatbotContainer = document.getElementById('chatbot-container');
        if (chatbotContainer.classList.contains('hidden')) {
            openChatbot();
        } else {
            closeChatbot();
        }
    }

    function openChatbot() {
        const chatbotContainer = document.getElementById('chatbot-container');
        chatbotContainer.classList.remove('hidden');
        document.body.classList.add('chatbot-open'); // Apply darkening effect
        document.getElementById('user-input').focus();
    }

    function closeChatbot() {
        const chatbotContainer = document.getElementById('chatbot-container');
        chatbotContainer.classList.add('hidden');
        document.body.classList.remove('chatbot-open'); // Remove darkening effect
        document.getElementById('chatbot-toggle').focus();
    }

    function dragElement(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById('chatbot-header');
        if (header) {
            header.onmousedown = dragMouseDown;
        } else {
            element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    async function sendMessage(event) {
        if (event.key === 'Enter') {
            event.preventDefault();  // Prevent form submission
            const userInput = document.getElementById('user-input').value;
            if (userInput.trim() === "") return;

            const chatbox = document.getElementById('chatbox');
            chatbox.innerHTML += `<div class="text-left"><strong>You:</strong> ${userInput}</div>`;
            document.getElementById('user-input').value = '';

            const response = await fetch('/chatbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userInput })
            });
            const data = await response.json();
            chatbox.innerHTML += `<div class="text-left"><strong>Bot:</strong> ${data.response}</div>`;
            chatbox.scrollTop = chatbox.scrollHeight;
        }
    }

    // Add keyboard navigation support
    document.addEventListener('keydown', function(event) {
        const chatbotToggle = document.getElementById('chatbot-toggle');
        const chatbotContainer = document.getElementById('chatbot-container');
        const userInput = document.getElementById('user-input');
        const closeButton = chatbotContainer.querySelector('button[aria-label="Close Chatbot"]');

        // Toggle chatbot with Enter key on the toggle button
        if (event.key === 'Enter' && document.activeElement === chatbotToggle) {
            toggleChatbot();
        }

        // Close chatbot with Enter key on the close button
        if (event.key === 'Enter' && document.activeElement === closeButton) {
            closeChatbot();
        }

        // Focus on user input when chatbot is opened
        if (!chatbotContainer.classList.contains('hidden')) {
            if (event.key === 'Tab' && document.activeElement === chatbotToggle) {
                userInput.focus();
                event.preventDefault();
            }
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        dragElement(document.getElementById('chatbot-container'));
    });

    // Attach event listeners
    document.getElementById('chatbot-toggle').addEventListener('click', toggleChatbot);
    document.getElementById('user-input').addEventListener('keypress', sendMessage);

    // Ensure the bounce animation only runs once on load
    const chatbotToggle = document.getElementById('chatbot-toggle');
    chatbotToggle.addEventListener('animationend', () => {
        chatbotToggle.style.animation = 'none';
    });

    // Make the chatbot container responsive
    window.addEventListener('resize', () => {
        const chatbotContainer = document.getElementById('chatbot-container');
        const chatbotToggle = document.getElementById('chatbot-toggle');
        if (window.innerWidth <= 640) {
            chatbotContainer.style.width = '100%';
            chatbotContainer.style.height = '50%';
            chatbotContainer.style.bottom = '0';
            chatbotContainer.style.right = '0';
            chatbotContainer.style.left = '0';
            chatbotContainer.style.maxHeight = '50%';
            chatbotContainer.style.borderRadius = '0';
            chatbotToggle.style.display = 'block'; // Ensure toggle button is visible on mobile
        } else {
            chatbotContainer.style.width = '20rem';
            chatbotContainer.style.height = 'auto';
            chatbotContainer.style.bottom = '1rem';
            chatbotContainer.style.right = '1rem';
            chatbotContainer.style.left = 'auto';
            chatbotContainer.style.maxHeight = '24rem';
            chatbotContainer.style.borderRadius = '0.5rem';
            chatbotToggle.style.display = 'block'; // Ensure toggle button is visible on desktop
        }
    });

    // Initial trigger to set correct sizes
    window.dispatchEvent(new Event('resize'));

    // Ensure the chatbot-toggle is visible on mobile
    window.addEventListener('load', function () {
        const toggle = document.getElementById('chatbot-toggle');
        if (window.innerWidth <= 640) {
            toggle.style.display = 'block';
        }
    });
}

// Call the initialization function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
});

// JavaScript to dynamically set the placeholder based on language
document.addEventListener('DOMContentLoaded', function() {
    const lang = document.body.getAttribute('data-lang') || 'en';
    const userInput = document.getElementById('user-input');
    if (lang === 'es') {
        userInput.placeholder = 'Ingresa tu mensaje...';
    } else {
        userInput.placeholder = 'Enter your message...';
    }
});

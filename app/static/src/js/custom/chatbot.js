document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
    setupCloseButton();
    feature1();
    feature2();
});

export function feature1() {
    // Feature 1 logic
}

export function feature2() {
    // Feature 2 logic
}

function initChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const userInput = document.getElementById('user-input');
    const sendButton = document.querySelector('.send-button');
    
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', toggleChatbot);
    } else {
        console.error('Chatbot toggle button not found');
    }

    if (userInput) {
        userInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendMessage(event);
            }
        });
    } else {
        console.error('User input field not found');
    }

    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
        sendButton.addEventListener('touchstart', sendMessage);
    } else {
        console.error('Send button not found');
    }

    window.addEventListener('resize', handleResize);
    handleResize();
}

function setupCloseButton() {
    const closeButton = document.getElementById('close-chatbot');
    if (closeButton) {
        closeButton.addEventListener('click', closeChatbot);
    } else {
        console.error('Close button not found');
    }
}

function toggleChatbot() {
    if (window.innerWidth <= 640) {
        openChatbotMobile();
    } else {
        const chatbotContainer = document.getElementById('chatbot-container');
        if (chatbotContainer && chatbotContainer.classList.contains('hidden')) {
            openChatbot();
        } else if (chatbotContainer) {
            closeChatbot();
        } else {
            console.error('Chatbot container not found');
        }
    }
}

function openChatbot() {
    const chatbotContainer = document.getElementById('chatbot-container');
    if (chatbotContainer) {
        chatbotContainer.classList.remove('hidden');
        document.body.classList.add('chatbot-open');
        document.getElementById('user-input').focus();

        const chatbox = document.getElementById('chatbox');
        const lang = document.body.getAttribute('data-lang') || 'en';

        if (!localStorage.getItem('initialMessagesShown')) {
            let messages;
            if (lang === 'es') {
                messages = [
                    "¡Hola! 🌟",
                    "¿Tienes preguntas sobre MYA, Olivea o DiVino?",
                    "¡Pregúntame, estoy aquí para ayudarte!"
                ];
            } else {
                messages = [
                    "Hey there! 🌟",
                    "Got questions about MYA, Olivea, or DiVino?",
                    "Ask away, I'm here to help!"
                ];
            }
            showInitialMessages(chatbox, messages, 'chatHistoryDesktop');
            localStorage.setItem('initialMessagesShown', 'true');
        } else {
            chatbox.innerHTML = localStorage.getItem('chatHistoryDesktop') || '';
        }
    } else {
        console.error('Chatbot container not found');
    }
}

function closeChatbot() {
    const chatbotContainer = document.getElementById('chatbot-container');
    if (chatbotContainer) {
        chatbotContainer.classList.add('hidden');
        document.body.classList.remove('chatbot-open');
        document.getElementById('chatbot-toggle').focus();
    } else {
        console.error('Chatbot container not found');
    }
}

function openChatbotMobile() {
    const lang = document.body.getAttribute('data-lang') || 'en';
    Swal.fire({
        title: 'Chatbot',
        html: `
            <div id="chatbot-container-swal" class="flex flex-col w-full h-full">
                <div id="chatbot-header-swal" class="p-4 flex justify-between items-center">
                    <img src="/static/dist/img/svg/mya-ai-bounce.svg" alt="Avatar" class="w-16 h-16">
                    <button id="close-chatbot-swal" class="text-white" aria-label="Close Chatbot">&times;</button>
                </div>
                <div id="chatbox-swal" class="flex-1 p-4 overflow-auto"></div>
                <div class="input-area-swal p-2 flex items-center">
                    <input type="text" id="user-input-swal" class="p-2 flex-grow focus:outline-none">
                    <button id="send-button-swal" class="send-button-swal" aria-label="Send message">
                        <img src="/static/dist/img/svg/sending.svg" alt="Sending">
                    </button>
                </div>
            </div>
        `,
        showCloseButton: false,
        showConfirmButton: false,
        customClass: {
            popup: 'chatbot-swal-popup'
        },
        width: '24rem',
        heightAuto: false,
        padding: '0',
        background: '#fff',
        backdrop: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            const chatbox = document.getElementById('chatbox-swal');
            if (!localStorage.getItem('initialMessagesShownMobile')) {
                let messages;
                if (lang === 'es') {
                    messages = [
                        "¡Hola! 🌟",
                        "¿Tienes preguntas sobre MYA, Olivea o DiVino?",
                        "¡Pregúntame, estoy aquí para ayudarte!"
                    ];
                } else {
                    messages = [
                        "Hey there! 🌟",
                        "Got questions about MYA, Olivea, or DiVino?",
                        "Ask away, I'm here to help!"
                    ];
                }
                showInitialMessages(chatbox, messages, 'chatHistoryMobile');
                localStorage.setItem('initialMessagesShownMobile', 'true');
            } else {
                chatbox.innerHTML = localStorage.getItem('chatHistoryMobile') || '';
            }

            const closeButton = document.getElementById('close-chatbot-swal');
            if (closeButton) {
                closeButton.addEventListener('click', () => Swal.close());
            } else {
                console.error('Close button for Swal modal not found');
            }

            const userInput = document.getElementById('user-input-swal');
            if (userInput) {
                userInput.addEventListener('keypress', (event) => {
                    if (event.key === 'Enter') {
                        sendMessageSwal(event);
                    }
                });
            } else {
                console.error('User input for Swal modal not found');
            }

            const sendButton = document.getElementById('send-button-swal');
            if (sendButton) {
                sendButton.addEventListener('click', sendMessageSwal);
                sendButton.addEventListener('touchstart', sendMessageSwal);
            } else {
                console.error('Send button for Swal modal not found');
            }
        }
    });
}

async function sendMessageSwal(event) {
    event.preventDefault();

    const userInput = document.getElementById('user-input-swal');
    const userInputValue = userInput.value;
    if (userInputValue.trim() === "") return;

    const chatbox = document.getElementById('chatbox-swal');
    chatbox.innerHTML += `<div class="text-left chatbot-message"><strong>You:</strong> ${userInputValue}</div>`;
    userInput.value = '';

    try {
        const response = await fetch('/chatbot/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInputValue })
        });
        const data = await response.json();
        chatbox.innerHTML += `<div class="text-left chatbot-message"><strong>Bot:</strong> ${data.response}</div>`;
        chatbox.scrollTop = chatbox.scrollHeight;
        localStorage.setItem('chatHistoryMobile', chatbox.innerHTML);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function sendMessage(event) {
    event.preventDefault();

    const userInput = document.getElementById('user-input');
    const userInputValue = userInput.value;
    if (userInputValue.trim() === "") return;

    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML += `<div class="text-left chatbot-message"><strong>You:</strong> ${userInputValue}</div>`;
    userInput.value = '';

    try {
        const response = await fetch('/chatbot/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInputValue })
        });
        const data = await response.json();
        chatbox.innerHTML += `<div class="text-left chatbot-message"><strong>Bot:</strong> ${data.response}</div>`;
        chatbox.scrollTop = chatbox.scrollHeight;
        localStorage.setItem('chatHistoryDesktop', chatbox.innerHTML);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

function showInitialMessages(chatbox, messages, historyKey) {
    chatbox.innerHTML = '';
    let delay = 0;
    messages.forEach((message) => {
        setTimeout(() => {
            chatbox.innerHTML += `<div class="text-left chatbot-message"><strong>Bot:</strong> ${message}</div>`;
            chatbox.scrollTop = chatbox.scrollHeight;
            localStorage.setItem(historyKey, chatbox.innerHTML);
        }, delay);
        delay += 1000;
    });
}

function handleResize() {
    const chatbotContainer = document.getElementById('chatbot-container');
    if (!chatbotContainer) {
        console.error('Chatbot container not found during resize');
        return;
    }

    if (window.innerWidth <= 640) {
        chatbotContainer.style.width = '100%';
        chatbotContainer.style.height = 'auto';
        chatbotContainer.style.bottom = '0';
        chatbotContainer.style.right = '0';
        chatbotContainer.style.left = '0';
        chatbotContainer.style.maxHeight = '100%';
        chatbotContainer.style.borderRadius = '0';
    } else {
        chatbotContainer.style.width = '20rem';
        chatbotContainer.style.height = 'auto';
        chatbotContainer.style.bottom = '1rem';
        chatbotContainer.style.right = '1rem';
        chatbotContainer.style.left = 'auto';
        chatbotContainer.style.maxHeight = '24rem';
        chatbotContainer.style.borderRadius = '0.5rem';
    }
}

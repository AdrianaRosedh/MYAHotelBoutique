function initChatbot() {
    function toggleChatbot() {
        if (window.innerWidth <= 640) {
            openChatbotMobile();
        } else {
            const chatbotContainer = document.getElementById('chatbot-container');
            if (chatbotContainer.classList.contains('hidden')) {
                openChatbot();
            } else {
                closeChatbot();
            }
        }
    }

    function openChatbot() {
        const chatbotContainer = document.getElementById('chatbot-container');
        chatbotContainer.classList.remove('hidden');
        chatbotContainer.style.width = '20rem';
        chatbotContainer.style.height = '28rem';
        chatbotContainer.style.maxHeight = '28rem';
        chatbotContainer.style.minHeight = '24rem';
        chatbotContainer.style.bottom = '1rem';
        chatbotContainer.style.right = '1rem';
        chatbotContainer.style.left = 'auto';
        chatbotContainer.style.borderRadius = '0.5rem';
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
    }

    function closeChatbot() {
        const chatbotContainer = document.getElementById('chatbot-container');
        chatbotContainer.classList.add('hidden');
        document.body.classList.remove('chatbot-open');
        document.getElementById('chatbot-toggle').focus();
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
            width: '100%',
            heightAuto: false,
            padding: '0',
            background: '#fff',
            backdrop: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                console.log("Modal opened");

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
                closeButton.addEventListener('click', () => Swal.close());

                const userInput = document.getElementById('user-input-swal');
                userInput.addEventListener('keypress', (event) => {
                    if (event.key === 'Enter') {
                        sendMessageSwal(event);
                    }
                });

                const sendButton = document.getElementById('send-button-swal');
                sendButton.addEventListener('click', (event) => sendMessageSwal(event));
                sendButton.addEventListener('touchstart', (event) => {
                    event.preventDefault();
                    sendMessageSwal(event);
                });

                userInput.focus();
            }
        });
    }

    async function sendMessageSwal(event) {
        event.preventDefault();

        const userInput = document.getElementById('user-input-swal');
        const userInputValue = userInput.value;
        if (userInputValue.trim() === "") return;

        console.log("Sending message:", userInputValue);

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
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong with sending your message!',
            });
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
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong with sending your message!',
            });
        }
    }

    function showInitialMessages(chatbox, messages, historyKey) {
        chatbox.innerHTML = '';
        let delay = 0;
        messages.forEach((message, index) => {
            setTimeout(() => {
                chatbox.innerHTML += `<div class="text-left chatbot-message"><strong>Bot:</strong> ${message}</div>`;
                chatbox.scrollTop = chatbox.scrollHeight;
                localStorage.setItem(historyKey, chatbox.innerHTML);
            }, delay);
            delay += 1000;
        });
    }

    document.addEventListener('keydown', function(event) {
        const chatbotToggle = document.getElementById('chatbot-toggle');
        const chatbotContainer = document.getElementById('chatbot-container');
        const userInput = document.getElementById('user-input');
        const closeButton = chatbotContainer.querySelector('button[aria-label="Close Chatbot"]');

        if (event.key === 'Enter' && document.activeElement === chatbotToggle) {
            toggleChatbot();
        }

        if (event.key === 'Enter' && document.activeElement === closeButton) {
            closeChatbot();
        }

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

    document.getElementById('chatbot-toggle').addEventListener('click', toggleChatbot);
    document.getElementById('user-input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage(event);
        }
    });
    document.querySelector('.send-button').addEventListener('click', (event) => sendMessage(event));
    document.querySelector('.send-button').addEventListener('touchstart', (event) => {
        event.preventDefault();
        sendMessage(event);
    });

    const chatbotToggle = document.getElementById('chatbot-toggle');
    chatbotToggle.addEventListener('animationend', () => {
        chatbotToggle.style.animation = 'none';
    });

    window.addEventListener('resize', () => {
        const chatbotContainer = document.getElementById('chatbot-container');
        const chatbotToggle = document.getElementById('chatbot-toggle');
        if (window.innerWidth <= 640) {
            chatbotContainer.style.width = '100%';
            chatbotContainer.style.height = 'auto';
            chatbotContainer.style.bottom = '0';
            chatbotContainer.style.right = '0';
            chatbotContainer.style.left = '0';
            chatbotContainer.style.maxHeight = '100%';
            chatbotContainer.style.borderRadius = '0';
            chatbotToggle.style.display = 'block';
        } else {
            chatbotContainer.style.width = '20rem';
            chatbotContainer.style.height = 'auto';
            chatbotContainer.style.bottom = '1rem';
            chatbotContainer.style.right = '1rem';
            chatbotContainer.style.left = 'auto';
            chatbotContainer.style.maxHeight = '24rem';
            chatbotContainer.style.borderRadius = '0.5rem';
            chatbotToggle.style.display = 'block';
        }
    });

    window.dispatchEvent(new Event('resize'));

    window.addEventListener('load', function () {
        const toggle = document.getElementById('chatbot-toggle');
        if (window.innerWidth <= 640) {
            toggle.style.display = 'block';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
});

document.addEventListener('DOMContentLoaded', function() {
    const lang = document.body.getAttribute('data-lang') || 'en';
    const userInput = document.getElementById('user-input');
    if (lang === 'es') {
        userInput.placeholder = 'Ingresa tu mensaje...';
    } else {
        userInput.placeholder = 'Enter your message...';
    }
});

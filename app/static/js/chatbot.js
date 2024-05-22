export function initChatbot() {
    function toggleChatbot() {
        const chatbotContainer = document.getElementById('chatbot-container');
        if (chatbotContainer.classList.contains('hidden')) {
            chatbotContainer.classList.remove('hidden');
        } else {
            chatbotContainer.classList.add('hidden');
        }
    }

    function closeChatbot() {
        document.getElementById('chatbot-container').classList.add('hidden');
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

    document.addEventListener('DOMContentLoaded', function() {
        dragElement(document.getElementById('chatbot-container'));
    });

    async function sendMessage(event) {
        if (event.key === 'Enter') {
            const userInput = document.getElementById('user-input').value;
            if (userInput.trim() === "") return;

            const chatbox = document.getElementById('chatbox');
            chatbox.innerHTML += `<div class="text-left"><strong>You:</strong> ${userInput}</div>`;
            document.getElementById('user-input').value = '';

            const response = await fetch('/chat', {
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

    // Attach event listeners
    document.getElementById('chatbot-toggle').addEventListener('click', toggleChatbot);
    document.getElementById('user-input').addEventListener('keypress', sendMessage);
}

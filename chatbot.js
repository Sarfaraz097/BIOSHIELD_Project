/* Chatbot JavaScript functionality */

document.addEventListener('DOMContentLoaded', function () {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const typingIndicator = document.getElementById('typing-indicator');

    // Toggle chatbot window visibility
    chatbotToggle.addEventListener('click', () => {
        if (chatbotWindow.style.display === 'flex') {
            chatbotWindow.style.display = 'none';
        } else {
            chatbotWindow.style.display = 'flex';
            chatbotInput.focus();
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
    });

    // Add message to chat window
    function addMessage(content, sender) {
        const messageElem = document.createElement('div');
        messageElem.classList.add('message', sender);

        const avatar = document.createElement('div');
        avatar.classList.add('message-avatar');
        avatar.textContent = sender === 'user' ? '👤' : '🤖';

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = content;

        if (sender === 'user') {
            messageElem.appendChild(messageContent);
            messageElem.appendChild(avatar);
        } else {
            messageElem.appendChild(avatar);
            messageElem.appendChild(messageContent);
        }

        chatbotMessages.appendChild(messageElem);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // FAQ dictionary with common questions and detailed answers
    const faq = [
        {
            keywords: ['animal', 'animals', 'livestock', 'cattle', 'pigs', 'poultry'],
            response: 'You can manage your animals in the Animals section. Add, edit, or view animal details there. You can track health, age, breed, and more.'
        },
        {
            keywords: ['vaccine', 'vaccines', 'vaccination', 'immunization', 'shots'],
            response: 'The Vaccines section helps you track and manage all vaccine schedules for your animals. You can set reminders and record vaccine history.'
        },
        {
            keywords: ['sensor', 'sensors', 'temperature', 'humidity', 'ammonia', 'environment'],
            response: 'Sensors monitor environmental data like temperature, humidity, and ammonia levels in your farm. You can view live sensor data and historical trends.'
        },
        {
            keywords: ['alert', 'alerts', 'warning', 'notification', 'notifications', 'critical'],
            response: 'Alerts notify you of any critical issues or warnings related to your farm’s health and safety. You can configure alert thresholds and view active alerts.'
        },
        {
            keywords: ['biosecurity', 'disease', 'contamination', 'infection', 'quarantine'],
            response: 'Biosecurity measures help protect your farm from diseases and contamination risks. Follow recommended protocols and monitor biosecurity status.'
        },
        {
            keywords: ['report', 'reports', 'analytics', 'summary', 'performance', 'health'],
            response: 'Reports provide detailed analytics and summaries of your farm’s performance and health. Generate custom reports to analyze trends and make decisions.'
        },
        {
            keywords: ['help', 'support', 'assist', 'question'],
            response: 'I am here to help! Ask me about animals, vaccines, sensors, alerts, biosecurity, or reports.'
        },
        {
            keywords: ['hello', 'hi', 'hey', 'greetings'],
            response: 'Hello! How can I assist you with your farm management today?'
        }
    ];

    // Enhanced response logic using FAQ dictionary
    function getBotResponse(message) {
        const msg = message.toLowerCase().trim();

        if (msg === '') {
            return 'Please type a message so I can assist you.';
        }

        for (const item of faq) {
            for (const keyword of item.keywords) {
                if (msg.includes(keyword)) {
                    return item.response;
                }
            }
        }

        // Fallback response
        return 'Sorry, I am not sure about that. Please ask about animals, vaccines, sensors, alerts, biosecurity, or reports.';
    }

    // Simulate typing indicator
    function showTypingIndicator() {
        typingIndicator.classList.add('show');
    }

    function hideTypingIndicator() {
        typingIndicator.classList.remove('show');
    }

    // Handle sending user message and bot response
    function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage === '') return;

        addMessage(userMessage, 'user');
        chatbotInput.value = '';
        chatbotInput.disabled = true;
        chatbotSend.disabled = true;

        showTypingIndicator();

        // Simulate bot typing delay
        setTimeout(() => {
            const botResponse = getBotResponse(userMessage);
            addMessage(botResponse, 'bot');
            hideTypingIndicator();
            chatbotInput.disabled = false;
            chatbotSend.disabled = false;
            chatbotInput.focus();
        }, 1000);
    }

    // Send message on button click
    chatbotSend.addEventListener('click', sendMessage);

    // Send message on Enter key press
    chatbotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});

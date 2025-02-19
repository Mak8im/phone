document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const generatedCode = document.getElementById('generatedCode');
    const codeInput = document.getElementById('codeInput');
    const connectBtn = document.getElementById('connectBtn');
    const chat = document.getElementById('chat');
    const messages = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    let socket;

    // Функция для генерации уникального кода
    function generateCode() {
        return Math.random().toString(36).substring(2, 10);
    }

    // Обработчик для генерации кода
    generateBtn.addEventListener('click', () => {
        const code = generateCode();
        generatedCode.textContent = `Ваш код: ${code}`;
        // Здесь вы должны отправить этот код на сервер и ожидать подключения собеседника
    });

    // Обработчик для подключения по коду
    connectBtn.addEventListener('click', () => {
        const code = codeInput.value.trim();
        if (code) {
            // Установите соединение с сервером WebSocket
            socket = new WebSocket('ws://ваш_сервер_здесь');

            socket.addEventListener('open', () => {
                // Отправьте на сервер сообщение о подключении с указанным кодом
                socket.send(JSON.stringify({ type: 'connect', code: code }));
                chat.style.display = 'block';
            });

            socket.addEventListener('message', (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'message') {
                    const messageElement = document.createElement('div');
                    messageElement.textContent = data.message;
                    messages.appendChild(messageElement);
                }
            });

            socket.addEventListener('close', () => {
                chat.style.display = 'none';
                alert('Соединение закрыто.');
            });

            socket.addEventListener('error', (error) => {
                console.error('Ошибка WebSocket:', error);
            });
        } else {
            alert('Пожалуйста, введите код.');
        }
    });

    // Обработчик для отправки сообщений
    sendBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message && socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'message', message: message }));
            messageInput.value = '';
        }
    });
});

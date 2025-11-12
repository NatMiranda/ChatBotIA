// Definir las constantes de la interfaz
const chatButton = document.getElementById('chat-button');
const closeButton = document.getElementById('close-button');
const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// URL de tu script de backend PHP
const API_URL = 'chat.php'; 

// 1. Funcionalidad de Abrir/Cerrar la Ventana
chatButton.addEventListener('click', () => {
    chatContainer.classList.toggle('hidden');
    userInput.focus(); // Enfocar el input al abrir
});

closeButton.addEventListener('click', () => {
    chatContainer.classList.add('hidden');
});

// 2. Función para añadir un mensaje al chat
function appendMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.innerHTML = message; // Usar innerHTML si Gemini devuelve Markdown/HTML
    chatBox.appendChild(messageDiv);
    
    // Desplazar hacia el último mensaje
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 3. Función principal de envío y comunicación con PHP/Gemini
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // A. Mostrar mensaje del usuario
    appendMessage(message, 'user');
    userInput.value = ''; // Limpiar el input
    sendButton.disabled = true; // Deshabilitar el botón mientras espera
    userInput.disabled = true;

    // B. Mostrar indicador de "escribiendo..." (opcional pero recomendado)
    const thinkingIndicator = document.createElement('div');
    thinkingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
    thinkingIndicator.innerHTML = '...';
    chatBox.appendChild(thinkingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // C. Llamada al backend PHP
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        // D. Procesar la respuesta
        const data = await response.json();
        
        // Eliminar el indicador de "escribiendo..."
        chatBox.removeChild(thinkingIndicator);

        if (data.success) {
            // Mostrar la respuesta del bot (Gemini)
            appendMessage(data.response, 'bot');
        } else {
            // Mostrar mensaje de error si el PHP devolvió un error
            appendMessage(`**Error del servidor:** ${data.details || 'Intenta de nuevo.'}`, 'bot');
            console.error('Error de API:', data.details);
        }

    } catch (error) {
        // En caso de error de red o fallo de fetch
        // Asegúrate de que thinkingIndicator existe antes de intentar eliminarlo
        if(document.querySelector('.typing-indicator')) {
             chatBox.removeChild(document.querySelector('.typing-indicator'));
        }
        appendMessage('**Error de conexión.** No se pudo contactar al servidor.', 'bot');
        console.error('Error de Fetch:', error);
    } finally {
        // E. Volver a habilitar la interfaz
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

// 4. Conectar la función de envío al botón y a la tecla Enter
sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (event) => {
    // Código 13 es la tecla Enter
    if (event.key === 'Enter') {
        sendMessage();
    }
});
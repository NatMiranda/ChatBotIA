document.addEventListener('DOMContentLoaded', () => {

// Definir las constantes de la interfaz
const chatButton = document.getElementById('chat-button');
const closeButton = document.getElementById('close-button');
const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// URL de tu script de backend PHP
const API_URL = 'chat.php'; 

console.log('Chat Button:', chatButton);
console.log('Chat Container:', chatContainer);

// 1. Funcionalidad de Abrir/Cerrar la Ventana
chatButton.addEventListener('click', () => {
    chatContainer.classList.toggle('hidden');
    // Solo enfoca si la variable userInput fue obtenida correctamente
    if (userInput) {
        userInput.focus(); 
    }
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
            // Mostrar respuesta exitosa
        } else {
            const errorMessage = data.details || 'Intenta de nuevo más tarde.';
            // Si el mensaje contiene "overloaded", muestra algo específico:
            if (errorMessage.includes("overloaded")) {
                 appendMessage('Asistente Ocupado: El modelo de IA está experimentando alta demanda. Por favor, intenta nuevamente en unos momentos.', 'bot');
            } else {
                 appendMessage(`Error del servidor: ${errorMessage}`, 'bot');
            }
            console.error('Error de API:', errorMessage);
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
        if (userInput) { // Protección
            userInput.disabled = false;
            userInput.focus();
        }
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
});
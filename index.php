    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="stylesheet" href="styles.css">

    </head>
    <body>
        
    <button id="chat-button" title="Abrir Chat de IA">
        <img src="comunicacion.png" alt="Icono" style="width: 50px; height: auto;">
    </button>

    <div id="chat-container" class="hidden">
        <div class="chat-header">
            Orquestin
            <button id="close-button">✖</button>
        </div>
        <div id="chat-box">
            <div class="message bot-message">
                ¡Hola! Soy Orquestin. ¿En qué puedo ayudarte hoy?
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="user-input" placeholder="Escribe tu mensaje..." autocomplete="off">
            <button id="send-button" title="Enviar mensaje">
                enter
            </button>
        </div>
    </div>
    <script src="chatbot.js"></script>

    </body>
    </html>
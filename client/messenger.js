// Create a new HTML document
const htmlDocument = document.implementation.createHTMLDocument();

// Set the document's HTML content
htmlDocument.documentElement.innerHTML = `
  <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Messenger Clone</title>
        <link rel="stylesheet" href="public/style.css">
        <!-- Add your other stylesheet links here -->
    </head>
    <body>
        <div class="container">
            <!-- Left Sidebar -->
            <nav class="vertical-nav">
                <!-- Add your navigation items here -->
            </nav>

            <div class="left-sidebar">
                <div class="chat-list">
                    <!-- Add your chat list items here -->
                </div>
            </div>

            <div class="main-chat">
                <div class="chat-header">
                    <!-- Add your chat header content here -->
                </div>
                <div class="chat-messages">
                    <div class="outer-container">
                        <div class="chat-container">
                            <div id="chatbox">
                                <p id="botStarterMessage" class="botText"><span>Loading...</span></p>
                            </div>
                            <div class="chat-bar-input-block">
                                <div id="userInput">
                                    <input id="textInput" class="input-box" type="text" name="msg" placeholder="Tap 'Enter' to send a message">
                                    <p></p>
                                </div>
                                <div class="chat-bar-icons">
                                    <!-- Add your chat icons here -->
                                </div>
                            </div>
                            <div id="chat-bar-bottom">
                                <p></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="user-profile">
                <!-- Add your user profile content here -->
            </div>
        </div>

        <!-- Add your script tags here -->
    </body>
  </html>
`;

// Append the new document to the current document's body
document.body.appendChild(htmlDocument.documentElement);

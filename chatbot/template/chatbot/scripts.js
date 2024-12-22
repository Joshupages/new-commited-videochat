const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

const API_KEY = "AIzaSyAq017UYKZjvSkIvu_gC7OsjjDAY2RiKYQ";
//removing beta and leavonly v1 ill try that later
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
}
const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

// Message element with dynamic classes and return the message
const createMesageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}
//response generated from Th API
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");
    
//Response according to the trained in the chat history bot response as per the user prompted text/message 
    chatHistory.push({
        role: "user",
        parts: [{ text:userData.message }, ...(userData.file.data ? [{inline_data: userData.file}] : [])]
    });

    //requesting API
    const requestOptions = {
        method: "POST",
        headers:{ "Content-Type": "application/json" },
        body: JSON.stringify({
             contents: chatHistory //[{
            //     parts: [{ text:userData.message }, ...(userData.file.data ? [{inline_data: userData.file}] : [])]
            // }]
        }) 
        
    }

    try {
    // handling message responsing functionality    
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

       const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\**(.*?)\**\**/g, "$1").trim();
       messageElement.innerText = apiResponseText;

       //Response according to the trained in the chat history bot response
       chatHistory.push({
            role: "model",
            parts: [{ text: apiResponseText }]//userData.message }], ...(userData.file.data ? [{inline_data: userData.file}] : [])]
       
        });

    } catch (error) {
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    }finally {
    //Reseting useerfile data, removing think indicators and thus scrolling chat to the bottom  
       userData.file = {};
       incomingMessageDiv.classList.remove("thinking");
       chatBody.scrollTo({ top: chatBody.scrollHeight, behavior:"smooth"});
    } 
}

// user out going message handler
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event("input"));

// create and the display user sent message
    const messageContent = `<div class="message-text"></div>
                            ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,
                            ${userData.file.data}" class="attachment" />` :"" }`;

    const  outgoingMessageDiv = createMesageElement(messageContent, "user-message");
// testing if textContent can be substituted with innertext
    outgoingMessageDiv .querySelector(".message-text").textContent =  userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior:"smooth"});


// Triple dot indicator for the bot aftre message sinding delat of 600seconds   
    setTimeout(() => {
        const messageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5z"></path>
                </svg>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;
        const  incomingMessageDiv = createMesageElement(messageContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior:"smooth"});
        generateBotResponse(incomingMessageDiv);
    }, 600);
}

// Enter key to send message
messageInput.addEventListener("keydown", (e)=> {
    const userMessage = e.target.value.trim();
    if(e.key === "Enter" && userMessage && !e.shiftkey && window.innerWidth > 768) {
        handleOutgoingMessage(e);
    }
});
// ensure handling of the messageInput field without keeping in scrolling 
messageInput.addEventListener("input", ()=> {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight >
    initialInputHeight ? "20px" : "40px";
});

// file input and cahanging
fileInput.addEventListener("change",() =>{
    const file =fileInput.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = (e) =>{ 
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];
// Store data in userDara
        userData.file = {
            data: base64String,
            mime_type: file.type
        }
        // console.log(userData);
        fileInput.value = "";
    }

    reader.readAsDataURL(file);
});


fileCancelButton.addEventListener("click", ()=> {
    userData.file = {};
    fileUploadWrapper.classList.remove("file-uploaded");
});


// emoji in the html file
const picker = new EmojiMart.Picker({
    theme: "auto",
    skinTonePosition: "preview",
     previewPosition: "none",//point_up",
    onEmojiSelect: (emoji) => {
        const {selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
      if(e.target.id === "emoji-picker") {
        document.body.classList.toggle("show-emoji-picker");
      }  else{
        document.body.classList.remove("show-emoji-picker");
      }
    } 
});

document.querySelector(".chat-form").appendChild(picker);

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
closeChatbot.addEventListener("click", ()=>document.body.classList.remove("show-chatbot"));
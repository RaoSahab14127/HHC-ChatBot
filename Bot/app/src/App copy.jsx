import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": "Speak Like you are Medical health Assistant"
}

function CApp() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Human Health Care Assistant! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    
    
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });


    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      
      
      if (apiMessages[(apiMessages.length)-1].content == "what is human health care"){
        setMessages([...chatMessages, {
          message: "An incredible start up founded by pakistani to take care forigen pakistani's parent in pakistan",
          sender: "ChatGPT"
        }])
        setIsTyping(false);
      }
      else if (apiMessages[(apiMessages.length)-1].content == "who is MD of human health care"){
        setMessages([...chatMessages, {
          message: "Dr. Atif",
          sender: "ChatGPT"
        }])
        setIsTyping(false);
      }
      else if (apiMessages[(apiMessages.length)-1].content == "who is lead doctor at human health care"){
        setMessages([...chatMessages, {
          message: "Dr. Beesnish",
          sender: "ChatGPT"
        }])
        setIsTyping(false);
      }
      else if (apiMessages[(apiMessages.length)-1].content == ("where is your head office" ||"where is human health care head office" )){
        setMessages([...chatMessages, {
          message: "Johar Mor",
          sender: "ChatGPT"
        }])
        setIsTyping(false);
      }
      else if (apiMessages[(apiMessages.length)-1].content == "who build this chat bot"){
        setMessages([...chatMessages, {
          message: "Engr. Rao Hammad Ali",
          sender: "ChatGPT"
        }])
        setIsTyping(false);
      }
      else{
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }])}
      setIsTyping(false);
    });
  }

  return (
    <div className="App">
      <div style={{  height: "400px", width: "400px" ,position: "fixed",
  bottom: "-1px", right:"-1px" }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default CApp
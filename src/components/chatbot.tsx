import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../interfaces/messageInterface";
import { ChatbotService } from "../services/chatbotService";
import { formatOrderMessage } from "../utils/formatOrders";
import { formatTextWithBold } from "../utils/formatText";


export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    
    localStorage.setItem('chatbotSessionId', newSessionId);
  }, []);

  const sendToAI = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await ChatbotService.sendMessage(message, sessionId);
  
      const botMessage: Message = {
        id: uuidv4(),
        text: response, 
        isUser: false,
        read: false,
      };
  
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch {

      const errorMessage: Message = {
        id: uuidv4(),
        text: "Desculpe, ocorreu um erro ao processar sua mensagem.",
        isUser: false,
        read: false,
      };
  
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMessage.trim() === "") return;

    const userMessage: Message = {
      id: uuidv4(),
      text: inputMessage,
      isUser: true,
      read: false,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");

    await sendToAI(inputMessage);
  };

  useEffect(() => {
    if (!initializedRef.current && sessionId) {
      initializedRef.current = true;
      
      const sendInitialMessage = async () => {
        setIsLoading(true);
        try {
          const response = await ChatbotService.sendMessage(
            "Olá, fale seu nome e faça uma saudação em 2 linhas...", 
            sessionId
          );
          
          const botMessage: Message = {
            id: uuidv4(),
            text: response,
            isUser: false,
            read: false
          };
          
          setMessages(prev => [...prev, botMessage]);
        } catch {
          const errorMessage: Message = {
            id: uuidv4(),
            text: "Erro 001: Mensagem de boas-vindas não enviada 😅\nRecuperando... Pronto! Olá 😊 Como posso ajudar hoje?",
            isUser: false,
            read: false
          };
          
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      };
      
      sendInitialMessage();
    }
  }, [sessionId]);

  useEffect(() => {
    if (isOpen) {
      markMessagesAsRead();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const markMessagesAsRead = () => {
    setMessages((prevMessages) => {
      return prevMessages.map((message) => {
        return { ...message, read: true };
      });
    });
  };

  useEffect(() => {
    const count = messages.filter(
      (message) => !message.read && !message.isUser
    ).length;
    setUnreadCount(count);
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-[28rem] h-[34rem] bg-gradient-to-b from-blue-800 to-primary shadow-2xl rounded-2xl flex flex-col text-white border border-blue-800 dark:from-dark-primary dark:to-cyan-800 dark:border-cyan-800">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/ia/devely.jpg"
                alt="IA Develfood"
                className="w-12 h-12 rounded-full"
              />
              <h2 className="text-lg font-bold">Devely</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-2 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`relative max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-white text-black rounded-tr-none shadow-md shadow-gray-600/20"
                      : "bg-blue-800 text-white rounded-tl-none dark:bg-dark-secondary shadow-md shadow-black/30"
                  }`}
                >
                  {message.isUser ? (
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  ) : message.text.includes("**Pedido") ? (
                    formatOrderMessage(message.text)
                  ) : (
                    <p className="whitespace-pre-wrap">
                      {formatTextWithBold(message.text)}
                    </p>
                  )}
                  <div
                    className={`absolute w-3 h-3 bg-inherit transform rotate-45 ${
                      message.isUser
                        ? "right-[-6px] top-3"
                        : "left-[-6px] top-3"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="relative max-w-[80%] p-3 rounded-lg bg-blue-800 text-white rounded-tl-none dark:bg-dark-secondary shadow-md shadow-black/30">
                  <p>Digitando...</p>
                  <div className="absolute w-3 h-3 bg-inherit transform rotate-45 left-[-6px] top-3"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="w-full p-2 pl-4 pr-12 rounded-lg bg-transparent text-white placeholder:text-white border border-white focus:outline-none"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-blue-900 transition-all cursor-pointer dark:hover:bg-dark-secondary"
                disabled={isLoading}
              >
                <Send size={20} className="text-white" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-5 rounded-full  transition-all flex items-center gap-2 animate-float"
        >
          <div className="relative">
            <img
              src="/images/ia/devely.jpg"
              alt="IA Develfood"
              className="w-16 h-16 rounded-full object-cover"
            />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs dark:bg-dark-secondary">
                {unreadCount}
              </div>
            )}
          </div>
        </button>
      )}
    </div>
  );
}

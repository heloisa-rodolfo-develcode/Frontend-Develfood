import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    {
      text: "Olá! Como posso ajudar você hoje?",
      isUser: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMessage.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputMessage, isUser: true },
    ]);

    setInputMessage("");

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Entendido! Em breve te responderei.", isUser: false },
      ]);
    }, 1000);
  };

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
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
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
                  <p>{message.text}</p>
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
          </div>
          <form onSubmit={handleSendMessage} className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="w-full p-2 pl-4 pr-12 rounded-lg bg-transparent text-white placeholder:text-white border border-white focus:outline-none"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-blue-900 transition-all cursor-pointer dark:hover:bg-dark-secondary"
              >
                <Send size={20} className="text-white" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-br from-blue-800 to-primary text-white p-5 rounded-full shadow-lg hover:bg-blue-800 transition-all flex items-center gap-2 animate-float dark:from-cyan-800 dark:to-dark-primary"
        >
          <MessageSquare size={20} /> Devely
        </button>
      )}
    </div>
  );
}
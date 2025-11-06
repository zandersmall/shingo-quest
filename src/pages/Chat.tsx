import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Image as ImageIcon, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = { 
      role: "user", 
      content: input || "What do you see in this image?",
      image: selectedImage || undefined
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    const imageToSend = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    // Create a placeholder for streaming response
    const assistantMessageIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const messagesToSend = [...messages, userMessage].map(msg => {
        if (msg.image) {
          return {
            role: msg.role,
            content: [
              { type: "text", text: msg.content },
              { type: "image_url", image_url: { url: msg.image } }
            ]
          };
        }
        return { role: msg.role, content: msg.content };
      });

      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: messagesToSend },
      });

      if (error) throw error;

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[assistantMessageIndex] = {
          role: "assistant",
          content: data.message,
        };
        return newMessages;
      });
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => prev.slice(0, -1));
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      <main className="w-full px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-red-500 via-primary to-red-600 bg-clip-text text-transparent">
            先生ボット • Sensei Bot
          </h1>
          <p className="text-muted-foreground text-lg">
            Your Japanese learning and driving guide | 日本語学習とドライブガイド
          </p>
        </div>

        <Card className="p-6 h-[calc(100vh-280px)] flex flex-col border-2 border-primary/20 shadow-xl">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center max-w-2xl">
                  <div className="text-6xl mb-4">🎌</div>
                  <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-semibold mb-2">こんにちは！Welcome to Sensei Bot!</p>
                  <p className="text-muted-foreground">
                    Ask me about Japanese language, culture, road signs, or driving in Japan!
                  </p>
                  <p className="text-sm mt-2 text-muted-foreground/80">
                    You can also upload images of road signs for detailed explanations
                  </p>
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-xl">先</span>
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-3 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted border border-primary/10 shadow-sm"
                  }`}
                >
                  {message.image && (
                    <img 
                      src={message.image} 
                      alt="Uploaded" 
                      className="max-w-full rounded-lg mb-2 max-h-64 object-contain border border-primary/20"
                    />
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl animate-pulse">先</span>
                </div>
                <div className="rounded-lg px-4 py-3 bg-muted border border-primary/10 shadow-sm">
                  <p className="text-muted-foreground animate-pulse">Sensei is thinking... 考え中...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="space-y-2">
            {selectedImage && (
              <div className="relative inline-block">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="max-h-32 rounded-lg border border-border"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="h-[60px] w-[60px] flex-shrink-0"
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Sensei about Japanese or driving... 日本語で質問してください"
                className="min-h-[60px] max-h-[120px]"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || (!input.trim() && !selectedImage)}
                size="icon"
                className="h-[60px] w-[60px] flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Chat;

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, FileText, TrendingUp } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const staticMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI medical assistant. I can help you interpret prediction results, answer questions about treatments, and provide evidence-based recommendations. How can I assist you today?",
    timestamp: new Date(Date.now() - 300000),
    suggestions: [
      "Explain this prediction result",
      "What are the treatment options?",
      "Show me similar cases",
      "Provide research references"
    ]
  }
];

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(staticMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getStaticResponse(input),
      timestamp: new Date(),
      suggestions: getRelatedSuggestions(input)
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput("");
  };

  const getStaticResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("predict") || lowerQuery.includes("result")) {
      return "Based on the prediction results, the model shows a confidence score of 87%. This indicates a high likelihood of the predicted outcome. Key factors influencing this prediction include patient age, medical history, and current biomarkers. I recommend reviewing the detailed breakdown in the prediction report.";
    }
    
    if (lowerQuery.includes("treatment") || lowerQuery.includes("therapy")) {
      return "For this case, evidence-based treatment options include:\n\n1. **Primary Treatment**: Targeted therapy with monoclonal antibodies\n2. **Adjuvant Therapy**: Combination chemotherapy protocol\n3. **Supportive Care**: Pain management and nutritional support\n\nRecent studies (2023-2024) show a 78% response rate with the primary treatment approach. Would you like me to provide specific dosing protocols or contraindications?";
    }
    
    if (lowerQuery.includes("research") || lowerQuery.includes("literature") || lowerQuery.includes("study")) {
      return "Here are relevant research references:\n\n📄 **Johnson et al. (2024)** - \"Advanced Machine Learning in Cancer Prediction\" - New England Journal of Medicine\n\n📄 **Smith & Chen (2023)** - \"Treatment Efficacy in High-Risk Patients\" - The Lancet Oncology\n\n📄 **Garcia et al. (2024)** - \"AI-Assisted Clinical Decision Making\" - JAMA\n\nThese studies support the current treatment recommendations with Level I evidence.";
    }
    
    if (lowerQuery.includes("similar") || lowerQuery.includes("case")) {
      return "I found 12 similar cases in the database:\n\n• **Case #2847**: 84% prediction match, successful outcome with targeted therapy\n• **Case #3921**: 79% prediction match, positive response to combination treatment\n• **Case #4156**: 91% prediction match, complete remission achieved\n\nThese cases had similar patient demographics and biomarker profiles. Would you like to review the detailed treatment protocols?";
    }
    
    return "I understand your question. For accurate medical information, I recommend consulting the latest clinical guidelines and research. I can help you interpret prediction results, suggest treatment protocols based on evidence, or find relevant medical literature. Please feel free to ask specific questions about predictions, treatments, or research references.";
  };

  const getRelatedSuggestions = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("predict")) {
      return [
        "What factors influenced this prediction?",
        "Show confidence breakdown",
        "Compare with similar predictions"
      ];
    }
    
    if (lowerQuery.includes("treatment")) {
      return [
        "Show treatment success rates",
        "What are the side effects?",
        "Are there alternative therapies?"
      ];
    }
    
    return [
      "Explain prediction confidence",
      "Show treatment guidelines",
      "Find relevant research"
    ];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          AI Medical Assistant
        </h1>
        <p className="text-muted-foreground">
          Get instant help interpreting predictions and evidence-based treatment recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-280px)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Chat Assistant
              </CardTitle>
              <CardDescription>
                Ask questions about predictions, treatments, or request medical literature
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-100px)]">
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-1">
                            {message.role === "assistant" && (
                              <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                            )}
                            <div className="whitespace-pre-wrap text-sm">
                              {message.content}
                            </div>
                          </div>
                          <div className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 ml-8">
                          {message.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask about predictions, treatments, or research..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setInput("Explain the latest prediction result")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Interpret Latest Prediction
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setInput("What are the recommended treatments?")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Treatment Guidelines
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setInput("Show me relevant research papers")}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Research References
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-1">AI</Badge>
                <div>
                  <p className="text-sm font-medium">Prediction Interpretation</p>
                  <p className="text-xs text-muted-foreground">
                    Explain model outputs and confidence scores
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-1">AI</Badge>
                <div>
                  <p className="text-sm font-medium">Treatment Recommendations</p>
                  <p className="text-xs text-muted-foreground">
                    Evidence-based therapy suggestions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-1">AI</Badge>
                <div>
                  <p className="text-sm font-medium">Medical Literature</p>
                  <p className="text-xs text-muted-foreground">
                    Quick access to research papers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-1">AI</Badge>
                <div>
                  <p className="text-sm font-medium">Case Comparison</p>
                  <p className="text-xs text-muted-foreground">
                    Find similar patient cases
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

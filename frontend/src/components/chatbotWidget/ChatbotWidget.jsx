import React, { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { set } from "date-fns";
import typingAnimation from "../../assets/typingAnimation.gif";

const backend = import.meta.env.VITE_BACKEND_URL;
const openCageApiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
const openCageUrl = "https://api.opencagedata.com/geocode/v1/json";
const frontend = import.meta.env.VITE_FRONTEND_URL;

const ChatbotWidget = () => {
  const messageEndRef = useRef(null);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const [step, setStep] = useState("intro");
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [issueState, setIssueState] = useState({
    title: "",
    description: "",
    category: "",
    location: null,
    image: null,
  });

  const [othersChatHistory, setOthersChatHistory] = useState([]);

  const toggleChat = () => setShow((prev) => !prev);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  };

  const sendBotMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage(input);
    const userText = input;
    setInput("");

    if (step === "report_waiting_issue") {
      setIsTyping(true);
      sendBotMessage("Analyzing your issue...");
      try {
        const geminiPrompt = `
                Given this civic issue description: "${userText}", generate a JSON object with:
                "title", "description", "category"

                The description should be concise and clear and tells clearly what the issue is.

                Category must be one of:
                roads, street light, sewage, water, electricity, garbage, others.

                Reply ONLY JSON, nothing else.
            `;
        const res = await axios.post(`${backend}/api/gemini/generate`, {
          prompt: geminiPrompt,
        });

        const raw = res.data.text.trim();
        const jsonMatch = raw.match(/{[\s\S]*}/);
        if (!jsonMatch) {
          setIsTyping(false);
          sendBotMessage("⚠️ Sorry, Please rephrase.");
          return;
        }
        let parsed;
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (err) {
          setIsTyping(false);
          sendBotMessage("⚠️ Parsing failed, please rephrase.");
          return;
        }

        setIssueState((prev) => ({
          ...prev,
          title: parsed.title,
          description: parsed.description,
          category: parsed.category,
        }));

        setIsTyping(false);
        sendBotMessage(
          `✅ Got it!\nTitle: ${parsed.title}\nCategory: ${parsed.category}\nDescription: ${parsed.description}`
        );
        sendBotMessage(
          "📍 Please allow location access, and wait for a moment while I get your location."
        );
        handleLocation();
      } catch (err) {
        setIsTyping(false);
        sendBotMessage("❌ Could not analyze the issue, please try again.");
      }
    }

    if (step === "track_waiting_id") {
      setIsTyping(true);
      try {
        const res = await axios.get(`${backend}/api/issue/issueId/${userText}`);
        const issue = res.data.issue;

        // Prepare data for prompt
        const issueData = {
          title: issue.title,
          status: issue.status,
          category: issue.category,
          description: issue.description || "No description provided.",
          createdBy: {
            name: issue.createdBy?.name || "Unknown",
            email: issue.createdBy?.email || "No email",
            role: issue.createdBy?.role || "Unknown role",
          },
          verifiedBy: {
            name: issue.verifiedBy?.name || "Not verified yet",
          },
          statusHistory: (issue.statusHistory || []).map((sh) => ({
            status: sh.status,
            updatedAt: sh.updatedAt,
            updatedBy: sh.updatedBy?.name || "Unknown",
          })),
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
        };

        const prompt = `
            You are a helpful AI assistant from "Report It" that formats a detailed issue status update in a friendly, clear, and concise way.

            Here is the issue data:
            ${JSON.stringify(issueData, null, 2)}

            Generate a human-friendly status message for a citizen, summarizing the current status, description, creator info, verification, and recent status changes. 
            Also format the message with bold, italics, and bullet points for clarity.
            Respond only with the message text.
        `;

        const geminiRes = await axios.post(`${backend}/api/gemini/generate`, {
          prompt,
        });

        const botReply = geminiRes.data.text.trim();
        setIsTyping(false);
        sendBotMessage(botReply);
        setStep("intro");
      } catch (err) {
        setIsTyping(false);
        sendBotMessage("❌ Issue not found with this ID or failed to fetch.");
      }
    }

    if (step === "others") {
      setIsTyping(true);
      setOthersChatHistory((prev = []) => {
        const updated = [...prev, { role: "user", content: userText }];
        if (updated.length > 20) {
          updated.shift(); //this will keep only last 20 messages
        }
        return updated;
      });
      try {
        const conversationHistory = [
          ...othersChatHistory,
          { role: "user", content: userText },
        ];

        let conversationText = "";
        conversationHistory.forEach((msg, idx) => {
          conversationText += `User: ${msg.content}\n`;
        }); //this will store user messages as User: massage content

        const prompt = `
                You are a helpful AI assistant for the "Report It" civic platform.
                Your name is "Report It AI Assistant".
                You are designed to assist citizens with:
                - reporting civic issues
                - tracking issue status
                - answering questions about civic processes, timelines, local regulations, office hours, helpline numbers, and other civic services.

                Use the following conversation history to give relevant answers.
                If you do not know something, politely suggest the user contact their local civic office or visit the official civic website.

                **Instructions:**
                - If the user clearly wants to **report a new issue**, tell them:  
                "Press the Cancel button to go back to the main menu and select 'Report Issue' to start the reporting process."  
                Also include this link on a new line:  
                [Go to Report Issue](${frontend}/report)  
                Tell them to click on the link.

                - If the user clearly wants to **track** their existing issue, tell them:  
                "Press the Cancel button to go back to the main menu and select 'Track Issue' to track your reported issue."  
                Also include this link on a new line:  
                [Go to Track Issue](${frontend}/status)  
                Tell them to click on the link.

                - If the user asks follow-up questions about a civic issue they already reported (for example:  
                "My street light is still broken" or  
                "When will my water issue be fixed?"), then answer politely with general civic knowledge about the category of the issue, expected timelines, common escalation paths, or whom to contact.

                - If the user asks any other general civic questions (like rules, fines, helplines, working hours, local regulations, or where to find information), answer them clearly and politely.

                - Do not hallucinate. If you are not confident in your answer, say "I do not have exact information on that, please contact your local civic office."

                **Conversation History:**
                ${conversationText}

                **Latest user message:**
                "${userText}"

                Provide a clear, concise, and polite answer.
                `;

        const res = await axios.post(`${backend}/api/gemini/generate`, {
          prompt,
        });

        const botReply = res.data.text.trim();
        setIsTyping(false);
        sendBotMessage(botReply);
        setOthersChatHistory((prev = []) => {
          const updated = [...prev, { role: "user", content: userText }];
          if (updated.length > 20) {
            updated.shift(); // keep only last 20 messages
          }
          return updated;
        });
      } catch (err) {
        setIsTyping(false);
        sendBotMessage("❌ Failed to process your query, please try again.");
      }
    }
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };

          try {
            // call OpenCage API to get address
            const res = await axios.get(`${openCageUrl}`, {
              params: {
                key: openCageApiKey,
                q: `${coords.latitude},${coords.longitude}`,
              },
            });

            const address =
              res.data?.results?.[0]?.formatted || "User provided location";

            setIssueState((prev) => ({
              ...prev,
              location: {
                ...coords,
                address,
              },
            }));

            sendBotMessage(`✅ Location captured\nPlease upload images now.`);
            setStep("report_waiting_image");
          } catch (err) {
            console.error("OpenCage API error", err);
            sendBotMessage(
              `✅ Coordinates captured but address lookup failed. Please upload images now.`
            );
            setIssueState((prev) => ({
              ...prev,
              location: {
                ...coords,
                address: "User provided location",
              },
            }));
            setStep("report_waiting_image");
          }
        },
        () => {
          sendBotMessage("❌ Could not get your location.");
        }
      );
    } else {
      sendBotMessage("❌ Geolocation not supported.");
    }
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIssueState((prev) => ({ ...prev, image: files }));
    sendBotMessage(
      `✅ Received ${files.length} image(s). Submitting your issue...`
    );
    setIsSubmitting(true);
    submitIssue(files);
  };

  const submitIssue = async (imageFiles) => {
    const formData = new FormData();
    formData.append("title", issueState.title);
    formData.append("category", issueState.category);
    formData.append("description", issueState.description);
    formData.append("location[address]", issueState.location.address);
    formData.append("location[latitude]", issueState.location.latitude);
    formData.append("location[longitude]", issueState.location.longitude);

    for (const file of imageFiles) {
      formData.append("images", file);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${backend}/api/issue`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      sendBotMessage(
        `🎉 Issue reported successfully!\nYour Issue ID: ${res.data.issueId}`
      );
      setStep("intro");
    } catch {
      sendBotMessage("❌ Failed to report the issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionClick = (option) => {
    if (option === "report") {
      sendBotMessage("📝 Please describe the issue you are facing.");
      setStep("report_waiting_issue");
    }
    if (option === "track") {
      sendBotMessage("🔎 Please enter your Issue ID to track.");
      setStep("track_waiting_id");
    }
    if (option === "others") {
      sendBotMessage("💬 Please type your query.");
      setStep("others");
    }
  };

  return (
    <>
      <div
        className="fixed bottom-4 right-6 bg-indigo-600 text-white rounded-full p-4 cursor-pointer shadow-lg z-50 hover:bg-indigo-500"
        onClick={toggleChat}
      >
        {show ? <X /> : "💬"}
      </div>

      {show && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-50">
          <div className="p-3 ps-5 border-b font-semibold bg-indigo-600 text-white rounded-t-lg">
            Report It AI Assistant
          </div>

          <div className="flex-1 p-2 overflow-y-auto space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-fit break-words whitespace-pre-wrap ${
                  m.sender === "bot"
                    ? "bg-gray-200 text-black self-start ml-2 mr-16 max-w-fit"
                    : "bg-indigo-500 text-white self-end text-left w-fit ml-auto mr-2 max-w-[70%] p-2 break-words rounded-lg"
                }`}
              >
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            ))}

            {isTyping && (
              <div className="self-start ml-2 mr-16">
                <img src={typingAnimation} alt="typing..." className="w-10 h-auto" />
              </div>
            )}

            {step === "report_waiting_image" && (
              <>
                {!isSubmitting ? (
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="mt-2 block w-full text-sm text-gray-600"
                  />
                ) : (
                  <div className="text-center text-sm text-gray-600 py-2">
                    ⏳ Submitting your issue, please wait...
                  </div>
                )}
              </>
            )}
            <div ref={messageEndRef} />
          </div>

          {step === "intro" && (
            <div className="p-2 border-t flex gap-2 bg-gray-50 rounded-b-lg">
              <Button
                size="sm"
                className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white"
                onClick={() => handleOptionClick("report")}
              >
                Report Issue
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white"
                onClick={() => handleOptionClick("track")}
              >
                Track Issue
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white"
                onClick={() => handleOptionClick("others")}
              >
                Others
              </Button>
            </div>
          )}

          {step !== "intro" && step !== "report_waiting_image" && (
            <form
              onSubmit={handleSubmit}
              className="p-2 border-t flex gap-2 bg-gray-50 rounded-b-lg"
            >
              <Input
                className="flex-1 text-black placeholder-gray-500"
                placeholder="Type..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button
                size="icon"
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-400 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}

          {step !== "intro" && (
            <div className="p-2 border-t flex justify-end bg-gray-50">
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-400 text-white"
                onClick={() => {
                  sendBotMessage("🔙 Exited current step.");
                  setStep("intro");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;

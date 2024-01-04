import React, { useState, useEffect } from "react";
import KeyValueForm from "./KeyValueForm";
import PromptField from "./PromptField";

interface KeyValuePair {
  key: string;
  value: string;
}

const App: React.FC = () => {
  const [keyValuePairs, setKeyValuePairs] = useState<KeyValuePair[]>(() => {
    const savedPairs = localStorage.getItem("keyValuePairs");
    return savedPairs ? JSON.parse(savedPairs) : [];
  });
  const [promptText, setPromptText] = useState<string>(() => {
    return localStorage.getItem("promptText") || "";
  });
  const [submittedPrompt, setSubmittedPrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string>(() => {
    return localStorage.getItem("answer") || "";
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("keyValuePairs", JSON.stringify(keyValuePairs));
  }, [keyValuePairs]);

  useEffect(() => {
    localStorage.setItem("promptText", promptText);
  }, [promptText]);

  useEffect(() => {
    localStorage.setItem("answer", answer);
  }, [answer]);

  useEffect(() => {
    document.title = "AI Prompter"; // Updating the title of the page
  }, []);

  const handleKeyValueChange = (newPairs: KeyValuePair[]) => {
    setKeyValuePairs(newPairs);
  };

  const handlePromptChange = (newPrompt: string) => {
    setPromptText(newPrompt);
  };

  const handleSubmit = async () => {
    let finalText = promptText;
    keyValuePairs.forEach((pair) => {
      finalText = finalText.replace(
        new RegExp(`@${pair.key}`, "g"),
        pair.value
      );
    });

    setSubmittedPrompt(finalText); // Update the submitted prompt
    setIsLoading(true);
    try {
      const response = await fetch("https://api.mega-mind.io/chat/command/", {
        method: "POST",
        headers: {
          "X-Api-key": process.env.API_KEY ?? '',
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: finalText }),
      });

      const data = await response.json();
      setAnswer(data.answer);
      setIsLoading(false);
    } catch (error) {
      console.error("Error making API request:", error);
      setIsLoading(false);
    }
  };

  const formatResponseText = (text: string) => {
    return { __html: text.replace(/\n/g, "<br>") };
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-left mb-16 lg:w-1/2">
        <h1 className="text-4xl font-bold">AI Prompter</h1>
        <p className="text-md mt-2">
          Welcome to AI Prompter, an interactive tool to send prompts to a
          server and view responses. Add key-value pairs, input your prompt, and
          submit to see the AI response. Refer the added keys by using the @
          symbol in the prompt box.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-8 space-y-8 lg:space-y-0">
        <div className="w-full lg:flex-1">
          <KeyValueForm
            keyValuePairs={keyValuePairs}
            onChange={handleKeyValueChange}
          />
          <div className="my-8">
            <PromptField
              promptText={promptText}
              keyValuePairs={keyValuePairs}
              onChange={handlePromptChange}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="p-2 bg-blue-500 text-white rounded w-full mb-8"
          >
            Submit
          </button>
          <div className="p-4 border border-gray-300 rounded mb-4 bg-white text-black">
            <h3 className="font-bold text-lg mb-2">Prompt Submitted to AI:</h3>
            <p>{submittedPrompt}</p>
          </div>
        </div>
        <div className="w-full lg:w-auto lg:flex-1 p-4 border border-gray-300 rounded bg-black text-white">
          <h3 className="font-bold text-lg mb-2">Response:</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading...</p>
            </div>
          ) : (
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "700px" }}
              dangerouslySetInnerHTML={formatResponseText(answer)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

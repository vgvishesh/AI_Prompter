import React, { useState, useEffect } from 'react';
import KeyValueForm from './KeyValueForm';
import PromptField from './PromptField';

interface KeyValuePair {
  key: string;
  value: string;
}

const App: React.FC = () => {
  const [keyValuePairs, setKeyValuePairs] = useState<KeyValuePair[]>(() => {
    const savedPairs = localStorage.getItem('keyValuePairs');
    return savedPairs ? JSON.parse(savedPairs) : [];
  });
  const [promptText, setPromptText] = useState<string>(() => {
    return localStorage.getItem('promptText') || '';
  });
  const [answer, setAnswer] = useState<string>(() => {
    return localStorage.getItem('answer') || '';
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('keyValuePairs', JSON.stringify(keyValuePairs));
  }, [keyValuePairs]);

  useEffect(() => {
    localStorage.setItem('promptText', promptText);
  }, [promptText]);

  useEffect(() => {
    localStorage.setItem('answer', answer);
  }, [answer]);

  const handleKeyValueChange = (newPairs: KeyValuePair[]) => {
    setKeyValuePairs(newPairs);
  };

  const handlePromptChange = (newPrompt: string) => {
    setPromptText(newPrompt);
  };

  const handleSubmit = async () => {
    let finalText = promptText;
    keyValuePairs.forEach(pair => {
      finalText = finalText.replace(new RegExp(`@${pair.key}`, 'g'), pair.value);
    });

    setIsLoading(true);
    try {
      const response = await fetch('https://api.mega-mind.io/chat/command/', {
        method: 'POST',
        headers: {
          'X-Api-key': 'TNTbN4zC',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: finalText }),
      });

      const data = await response.json();
      setAnswer(data.answer);
      setIsLoading(false);
    } catch (error) {
      console.error('Error making API request:', error);
      setIsLoading(false);
    }
  };

  const formatResponseText = (text: string) => {
    return { __html: text.replace(/\n/g, '<br>') };
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-8 space-y-8 lg:space-y-0">
        <div className="flex-1 overflow-auto">
          <KeyValueForm keyValuePairs={keyValuePairs} onChange={handleKeyValueChange} />
          <div className="my-8">
            <PromptField promptText={promptText} keyValuePairs={keyValuePairs} onChange={handlePromptChange} />
          </div>
          <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded w-full mb-8">
            Submit
          </button>
        </div>
        <div className="flex-1 p-4 border border-gray-300 rounded max-h-[700px] overflow-y-auto bg-black text-white">
          <h3 className="font-bold text-lg mb-2">Response:</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading...</p>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={formatResponseText(answer)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

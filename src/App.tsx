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

  return (
    <div className="flex justify-center items-start space-x-8 m-8">
      <div>
        <KeyValueForm keyValuePairs={keyValuePairs} onChange={handleKeyValueChange} />
        <div className="my-16">
          <PromptField promptText={promptText} keyValuePairs={keyValuePairs} onChange={handlePromptChange} />
        </div>
        <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded w-full">
          Submit
        </button>
      </div>
      <div className="p-4 border border-gray-300 rounded" style={{ maxWidth: '500px', maxHeight: '700px', overflowY: 'auto', backgroundColor: 'black', color: 'white' }}>
        <h3 className="font-bold text-lg mb-2">Response:</h3>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p> {/* Replace with a spinner or loader component if available */}
          </div>
        ) : (
          <p className="text-justify">{answer}</p>
        )}
      </div>
    </div>
  );
};

export default App;

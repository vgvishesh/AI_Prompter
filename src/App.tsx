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

  useEffect(() => {
    localStorage.setItem('keyValuePairs', JSON.stringify(keyValuePairs));
  }, [keyValuePairs]);

  useEffect(() => {
    localStorage.setItem('promptText', promptText);
  }, [promptText]);

  const handleKeyValueChange = (newPairs: KeyValuePair[]) => {
    setKeyValuePairs(newPairs);
  };

  const handlePromptChange = (newPrompt: string) => {
    setPromptText(newPrompt);
  };

  const handleSubmit = () => {
    let finalText = promptText;
    keyValuePairs.forEach(pair => {
      finalText = finalText.replace(new RegExp(`@${pair.key}`, 'g'), pair.value);
    });
    // Here, make the API call with finalText
    console.log('Final Text for Submission:', finalText);
    // Example: axios.post('your-api-endpoint', { data: finalText });
  };

  return (
    <div>
      <KeyValueForm keyValuePairs={keyValuePairs} onChange={handleKeyValueChange} />
      <PromptField promptText={promptText} keyValuePairs={keyValuePairs} onChange={handlePromptChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default App;

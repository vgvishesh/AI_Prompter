import React, { useState, useEffect, useRef } from 'react';

interface KeyValuePair {
  key: string;
  value: string;
}

interface PromptFieldProps {
  promptText: string;
  keyValuePairs: KeyValuePair[];
  onChange: (newPrompt: string) => void;
}

const PromptField: React.FC<PromptFieldProps> = ({ promptText, keyValuePairs, onChange }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getCaretCoordinates = () => {
    if (!textareaRef.current) return { top: 0, left: 0 };

    const { offsetTop, offsetLeft } = textareaRef.current;
    return { top: offsetTop + 20, left: offsetLeft + 10 }; // Adjust as needed
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '@') {
      const coordinates = getCaretCoordinates();
      setDropdownPosition(coordinates);
      setShowDropdown(true);
    }
  };

  const handleKeySelection = (key: string) => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      let textBeforeCursor = promptText.substring(0, cursorPosition);

      const atSymbolPosition = textBeforeCursor.lastIndexOf('@');
      if (atSymbolPosition !== -1) {
        textBeforeCursor = textBeforeCursor.substring(0, atSymbolPosition);
      }

      const textAfterCursor = promptText.substring(cursorPosition);
      const newValue = `${textBeforeCursor}@${key}${textAfterCursor}`;
      onChange(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = textBeforeCursor.length + key.length + 1;
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
          textareaRef.current.focus();
        }
      }, 0);

      setShowDropdown(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Prompt</h2>
      <textarea
        ref={textareaRef}
        value={promptText}
        onChange={handleTextAreaChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter prompt text here"
        className="w-full p-2 border border-gray-300 rounded"
        style={{ height: '150px' }}
      />
      {showDropdown && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 1000,
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid black'
          }}
        >
          {keyValuePairs.map((pair, index) => (
            <div
              key={index}
              onClick={() => handleKeySelection(pair.key)}
              style={{ cursor: 'pointer', padding: '5px' }}
            >
              {pair.key}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptField;

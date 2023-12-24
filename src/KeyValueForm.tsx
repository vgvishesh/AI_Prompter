import React from 'react';

interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueFormProps {
  keyValuePairs: KeyValuePair[];
  onChange: (newPairs: KeyValuePair[]) => void;
}

const KeyValueForm: React.FC<KeyValueFormProps> = ({ keyValuePairs, onChange }) => {
  const handleAddPair = () => {
    onChange([...keyValuePairs, { key: '', value: '' }]);
  };

  const handleRemovePair = (index: number) => {
    const newPairs = keyValuePairs.filter((_, i) => i !== index);
    onChange(newPairs);
  };

  const handleChange = (index: number, key: string, value: string) => {
    const newPairs = keyValuePairs.map((pair, i) => {
      if (i === index) {
        return { key, value };
      }
      return pair;
    });
    onChange(newPairs);
  };

  return (
    <div>
      {keyValuePairs.map((pair, index) => (
        <div key={index}>
          <input
            type="text"
            value={pair.key}
            onChange={(e) => handleChange(index, e.target.value, pair.value)}
            placeholder="Key"
          />
          <input
            type="text"
            value={pair.value}
            onChange={(e) => handleChange(index, pair.key, e.target.value)}
            placeholder="Value"
          />
          <button onClick={() => handleRemovePair(index)}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddPair}>Add Pair</button>
    </div>
  );
};

export default KeyValueForm;

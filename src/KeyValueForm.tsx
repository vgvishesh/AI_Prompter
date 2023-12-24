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
        <div key={index} className="flex items-center space-x-3 mb-3">
          <input
            type="text"
            value={pair.key}
            onChange={(e) => handleChange(index, e.target.value, pair.value)}
            placeholder="Key"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <textarea
            value={pair.value}
            onChange={(e) => handleChange(index, pair.key, e.target.value)}
            placeholder="Value"
            className="flex-1 p-2 border border-gray-300 rounded"
            rows={3}
          />
          <button onClick={() => handleRemovePair(index)} className="p-2 bg-red-500 text-white rounded">
            Remove
          </button>
        </div>
      ))}
      <button onClick={handleAddPair} className="p-2 bg-blue-500 text-white rounded">
        Add Pair
      </button>
    </div>
  );
};

export default KeyValueForm;

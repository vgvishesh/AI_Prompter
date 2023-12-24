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
      <h2 className="text-2xl font-bold mb-4">Custom Data</h2>
      {keyValuePairs.map((pair, index) => (
        <div key={index} className="flex items-start space-x-3 mb-3">
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
            style={{ maxWidth: '500px', maxHeight: '250px' }}
            rows={3}
          />
          <button onClick={() => handleRemovePair(index)} className="text-red-500">
            Remove
          </button>
        </div>
      ))}
      <button onClick={handleAddPair} className="p-2 bg-gray-800 text-white rounded w-full">
        Add Pair
      </button>
    </div>
  );
};

export default KeyValueForm;

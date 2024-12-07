import { useState } from 'react';

type ListInputProps = {
  label: string;
  className: string;
};

const ListInput = ({ label, className }: ListInputProps) => {
  const [items, setItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const addItem = (newItem: string) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const removeItem = (itemToRemove: string) => {
    setItems((prevItems) => prevItems.filter((item) => item !== itemToRemove));
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'Enter' && inputValue?.length) {
      addItem(inputValue);
      setInputValue(''); // Reset the input field (optional)
    }
  };

  return (
    <div className={`${className}`}>
      <label className="form-control w-full">
        {label && (
          <div className="label">
            <span className="label-text text-medium font-semibold">
              {label}
            </span>
          </div>
        )}
        <input
          type="text"
          placeholder="例：東京、ソウル、ロサンゼルス"
          className="input input-bordered w-full"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </label>
      {items.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <button
              key={`${index}-${item}`}
              className="badge bg-base-200 hover:bg-base-300 gap-2 py-3"
              onClick={() => removeItem(item)}
            >
              {item}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-4 w-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListInput;

import { useState, memo } from 'react';
import { Validator, AsyncValidator } from '../../types/validation';

type ListInputProps = {
  label?: string;
  className?: string;
  placeholder: string;
  items: string[]; // 親コンポーネントから渡されるprops
  onItemsChange: (updatedItems: string[]) => void; // 親コンポーネントのitemsを更新するためのコールバック
  validator?: Validator | AsyncValidator;
};

// 再レンダリングの最適化のための機能
const areEqual = (prevProps: ListInputProps, nextProps: ListInputProps) => {
  return prevProps.items === nextProps.items;
};

const ListInput = memo(
  ({
    label,
    className,
    items,
    onItemsChange,
    placeholder,
    validator,
  }: ListInputProps) => {
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [error, setError] = useState<string | null | undefined>(null);

    const addItem = async (newItem: string) => {
      if (items.some((item) => item.toLowerCase() === newItem.toLowerCase())) {
        setError('このアイテムはすでにリストに存在します');
        return;
      }

      if (validator) {
        try {
          setLoading(true);
          const errorMessage = await Promise.resolve(validator(newItem));
          if (errorMessage) {
            setLoading(false);
            setError(errorMessage);
            return;
          }
        } catch (e) {
          setLoading(false);
          setError('検証中にエラーが発生しました');
          return;
        }
      }
      setLoading(false);
      setError(null);
      onItemsChange([...items, newItem]);
    };

    const removeItem = (itemToRemove: string) => {
      onItemsChange(items.filter((item) => item !== itemToRemove));
    };

    const handleKeyDown = (e: { key: string }) => {
      if (e.key === 'Enter' && inputValue?.length) {
        setError(null);
        addItem(inputValue);
        setInputValue('');
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
          {!loading ? (
            <input
              type="text"
              placeholder={placeholder}
              className={`input input-bordered w-full ${error && 'input-error'}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <input
              type="text"
              placeholder="しばらくお待ちください。。。"
              className={`input input-bordered w-full ${error && 'input-error'}`}
              value={inputValue}
              disabled
            />
          )}
          {error && (
            <div className="label">
              <span className="label-text-alt text-error">{error}</span>
            </div>
          )}
        </label>
        {items.length > 0 && !loading && (
          <div className="mt-2 flex flex-wrap gap-2">
            {items.map((item, index) => (
              <button
                key={`${index}-${item}`}
                className="badge bg-base-200 hover:bg-base-300 gap-2 py-3"
                onClick={() => removeItem(item)}
              >
                {item}
                <span className="material-icons">close</span>
              </button>
            ))}
          </div>
        )}
        {loading && <span className="loading loading-spinner"></span>}
      </div>
    );
  },
  areEqual // カスタム比較関数を追加
);

export default ListInput;

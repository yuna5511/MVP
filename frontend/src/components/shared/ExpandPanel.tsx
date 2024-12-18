import { useState, ReactNode } from 'react';

type Props = {
  parentRef?: any;
  handleDelete?: () => void;
  hasDivider?: boolean;
  title: string;
  children: ReactNode;
  collapsedDescription?: string;
};

const ExpandPanel = ({
  parentRef,
  handleDelete,
  hasDivider = true,
  title,
  children,
  collapsedDescription,
}: Props) => {
  const [show, setShow] = useState(true);
  const handleToggle = () => setShow((prevState) => !prevState);
  return (
    <div className="flex flex-col w-full max-w-[640px]" ref={parentRef}>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <button
            className="btn btn-square btn-sm btn-ghost p-0"
            onClick={handleToggle}
          >
            <span className="material-icons">
              {show ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
            </span>
          </button>
          <h1 className="font-bold text-2xl">{title}</h1>
        </div>
        {handleDelete && (
          <button className="btn btn-square btn-sm btn-ghost">
            <span className="material-icons">delete</span>
          </button>
        )}
      </div>
      <div className="mt-4">
        <div
          className={`transition-all ${show ? 'opacity-100' : 'opacity-0 hidden'} ease-in-out delay-100 duration-200 w-full`}
        >
          {children}
        </div>
        <div
          className={`transition-all ${!show ? 'opacity-100' : 'opacity-0 hidden'} ease-in-out delay-100 duration-200 w-full`}
        >
          {collapsedDescription}
        </div>
      </div>
      {hasDivider && <div className="divider"></div>}
    </div>
  );
};

export default ExpandPanel;
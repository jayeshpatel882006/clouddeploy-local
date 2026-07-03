import { useState, useRef, useEffect } from "react";

const positions = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowPositions = {
  top: "top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-700",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-slate-700",
  left: "left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-slate-700",
  right: "right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-slate-700",
};

const Tooltip = ({ children, content, position = "top", delay = 200, className = "" }) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  if (!content) return children;

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          className={`absolute z-50 ${positions[position] || positions.top}`}
          role="tooltip"
        >
          <div className="whitespace-nowrap rounded-lg border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 shadow-lg">
            {content}
          </div>
          <div className={`absolute ${arrowPositions[position] || arrowPositions.top}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;

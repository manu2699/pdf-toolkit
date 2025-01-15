import React, { useState, ReactNode, useEffect } from 'react';

import { clsx } from 'clsx';


interface TabProps {
  value?: string;
  onChange?: (value: string) => void;
  layout?: 'horizontal' | 'vertical';
  children: ReactNode;
}

interface TabItemProps {
  children: ReactNode,
  className?: string,
  value: string;
  isActive?: boolean;
  layout?: 'horizontal' | 'vertical';
  onClick?: (value: string) => void;
  isFirstTab?: boolean;
  isLastTab?: boolean;
}


export const Tabs: React.FC<TabProps> = ({ value, onChange, children, layout = 'horizontal' }) => {

  const [localValue, setLocalValue] = useState<string>("");

  useEffect(function onValueChange(){
    if(value) setLocalValue(value);
  }, [value]);

  function handleTabChange(value: string){
    if(onChange){
      return onChange(value);
    }
    setLocalValue(value);
  }

  const validTabs = React.Children.toArray(children).filter((child) => React.isValidElement(child) && (child as React.ReactElement).type === Tab) as React.ReactElement[];

  const activeValue = localValue || validTabs?.[0].props.value;

  return (
    <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg">
      {validTabs.map((child, index) => {
        return React.cloneElement(child, {
          onClick: handleTabChange,
          isActive: child.props.value === activeValue,
          layout,
          isFirstTab: index === 0,
          isLastTab: index === validTabs.length - 1,
        })
      })}
    </div>
  );
};


export const Tab: React.FC<TabItemProps> = ({ children, isActive, onClick, value, layout, className, isFirstTab, isLastTab }) => {
  return (
    <button
      onClick={() => onClick && onClick(value)}
      className={clsx(
        'text-sm flex items-center gap-2 px-4 py-2 rounded transition-colors ',
        isLastTab && 'rounded-r-lg',
        isFirstTab && 'rounded-l-lg',
        layout === 'vertical' ? 'flex-col ' : ' ',
        isActive ? 'bg-blue-500 text-white '
          : 'text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 ',
        className,
      )}
    >
      {children}
    </button>
  )
}

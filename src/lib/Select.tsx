import React, { useEffect, useState, useRef } from "react";

import styles from "./Select.module.css";

type SingleSelectProps = {
  value?: SelectOption | undefined;
  onChange: (value: SelectOption | undefined) => void;
  multiple?: false;
  creatable?: false;
};

type MultipleSelectProps = {
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
  multiple: true;
  creatable?: true;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

export type SelectOption = {
  label: string;
  value: string | number;
};

function Select({
  value,
  onChange,
  options,
  multiple,
  creatable,
}: SelectProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;

      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prevState) => !prevState);
          selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          // - cercado por {} para a váriavel newValue não vazar do escopo do switch
          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }

        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  const isOpenStyle = isOpen ? styles["show"] : "";

  const clearOptions = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    multiple ? onChange([]) : onChange(undefined);
  };

  const selectOption = (option: SelectOption) => {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }

    setIsOpen(false);
  };

  const isOptionSeleted = (option: SelectOption) => {
    return multiple ? value.includes(option) : option === value;
  };

  return (
    <div
      className={`${styles["container"]}`}
      tabIndex={0}
      onClick={() => setIsOpen((prevValue) => !prevValue)}
      onBlur={() => setIsOpen(false)}
      // onKeyDown={}
      ref={containerRef}
      contentEditable={creatable}
    >
      <span className={`${styles["value"]}`}>
        {multiple
          ? value.map((val) => (
              <button
                key={val.value}
                className={`${styles["option-badge"]}`}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(val);
                }}
              >
                {val.label}
                <span className={`${styles["remove-btn"]}`}>&times;</span>
              </button>
            ))
          : value?.label}
      </span>
      <button className={`${styles["clear-btn"]}`} onClick={clearOptions}>
        &times;
      </button>
      <div className={`${styles["divider"]}`}></div>
      <div className={`${styles["caret"]}`}></div>
      <ul className={`${styles["options"]} ${isOpenStyle}`}>
        {options.map((option, index) => (
          <li
            key={option.value}
            className={`${styles["option"]} ${
              isOptionSeleted(option) ? styles["selected"] : ""
            } ${index === highlightedIndex ? styles["highlighted"] : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Select;

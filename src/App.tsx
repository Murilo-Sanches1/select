import React, { useState } from "react";
import "./App.css";
import Select, { SelectOption } from "./lib/Select";

const options = [
  { label: "Primeiro", value: 1 },
  { label: "Segundo", value: 2 },
  { label: "Terceiro", value: 3 },
  { label: "Quarto", value: 4 },
  { label: "Quinto", value: 5 },
  { label: "Sexto", value: 6 },
];

function App() {
  const [value, setValue] = useState<SelectOption | undefined>(options[0]);
  const [valueM, setValueM] = useState<SelectOption[]>([options[0]]);

  return (
    <div className="App">
      <Select
        options={options}
        value={value}
        onChange={(option) => {
          setValue(option);
        }}
      />
      <br />
      <Select
        options={options}
        value={valueM}
        onChange={(option) => {
          setValueM(option);
        }}
        multiple
      />
    </div>
  );
}

export default App;

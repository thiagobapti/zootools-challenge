import React from "react";
import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  font-size: 14px;
`;

const VariableInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => {
  return <Input type="text" value={value} onChange={onChange} />;
};

export default VariableInput;

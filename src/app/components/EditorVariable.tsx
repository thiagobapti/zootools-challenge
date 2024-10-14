import styled from "styled-components";
import { createReactInlineContentSpec } from "@blocknote/react";

const Root = styled.span`
  background-color: #2563eb;
  color: #fff;
  border-radius: 30px;
  padding: 2px 0.65em;
  font-size: 13px;
  font-weight: 600;
`;

export const EditorVariable = createReactInlineContentSpec(
  {
    type: "mention",
    propSchema: {
      variableId: {
        default: "Unknown",
      },
      variableLabel: {
        default: "Unknown",
      },
    },
    content: "none",
  },
  {
    render: (props) => <Root>{props.inlineContent.props.variableLabel}</Root>,
  }
);

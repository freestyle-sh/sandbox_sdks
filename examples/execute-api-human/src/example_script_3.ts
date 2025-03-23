export default `

\import React from "react";
import { renderToString } from "react-dom/server.edge";

console.log("Burrito");
const count = 12;
export default () => {
return renderToString(
    <h1>
      {Array.from({ length: count }, (_, i) => (
        <p key={i}>with the text of the {i}</p>
      ))}
    </h1>
  )

}
`;

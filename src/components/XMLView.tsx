// import React, { useEffect } from 'react';
// import ReactMarkdown from 'react-markdown';

// interface MarkdownViewProps {
//   url: string;
// }

// const MarkdownView: React.FC<MarkdownViewProps> = ({ url }) => {
//   const [markdownContent, setContent] = React.useState<string | null>(null);

//   useEffect(() => {
//     const getResultView = (async () => {
//         const response = await fetch(url);
//         if (response) {
//             console.log(response);
//         }
//     });
//     getResultView();
//   }, []);

//   return (
//     <div className="markdown-body">
//     <p>marddwon</p>
//       <ReactMarkdown>{url}</ReactMarkdown>
//     </div>
//   );
// };

// export default MarkdownView;

import React, { useEffect, useState } from "react";
import { parseJacocoXml } from "../utils/jacoco";
import { CoverageMetrics } from "../types";

interface XMLViewProps {
  url: string;   // URL to a JaCoCo HTML report
}

const XMLView: React.FC<XMLViewProps> = ({ url }) => {
  const [converage, setCoverage] = useState<CoverageMetrics>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadXML() {
      try {
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
          console.error(`Failed to load HTML: ${response.status}`);
          return;
        }

        const xmlText = await response.text();
        const cov = parseJacocoXml(xmlText);
        setCoverage(cov)
      } catch (err) {
        console.error("Error fetching HTML:", err);
      } finally {
        setLoading(false);
      }
    }

    loadXML();
  }, [url]);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading coverage report…</p>;
  }

  return (
    <>
    {
      JSON.stringify(converage)
    }
    </>
  );
};

export default XMLView;


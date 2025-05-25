import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import axios from "axios";

function App() {
  const [code, setCode] = useState(`def sum():  \n  return a + b \n`);
  const [review, setReview] = useState("");

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    const response = await axios.post("http://localhost:3000/ai/get-review/", {
      code,
    });
    setReview(response.data);
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 gap-6">
      {/* Header */}
      <header className="w-full text-center py-4 text-3xl font-bold bg-black shadow-lg rounded-lg">
        AI Code Reviewer 🤖
      </header>

      <div className="flex w-full max-w-6xl gap-6">
        {/* Editor Panel */}
        <div className="flex-1 h-[80vh] bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 overflow-auto flex flex-col">
          <input
            type="file"
            accept=".js, .py, .css, .cpp, .cs, .ts, .html, .json, .java ,.go"
            onChange={handleFileUpload}
            className="mb-4 text-sm text-gray-400 cursor-pointer bg-gray-700 p-2 rounded-lg"
          />

          <div className="flex-1 border border-gray-600 rounded-lg p-4 bg-gray-900 overflow-auto">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{ fontFamily: "Fira Code, monospace", fontSize: 16 }}
            />
          </div>

          <button
            onClick={reviewCode}
            className="w-full mt-4 py-3 text-lg font-semibold text-white bg-black hover:bg-gray-950 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            Review Code 🤖
          </button>
        </div>

        {/* Review Panel */}
        <div className="flex-1 h-[80vh] bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 overflow-auto flex flex-col">
          <div className="flex-1 text-gray-300 overflow-auto">
            {review ? (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {review}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-500 italic">AI suggestions will appear here…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


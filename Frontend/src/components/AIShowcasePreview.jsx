const AIShowcasePreview = () => (
  <div className="ai-showcase-preview" role="img" aria-label="Preview of the AI code tools">
    <div className="ai-showcase-toolbar">
      <h4>AI Tools</h4>
      <div className="ai-showcase-actions" aria-hidden="true">
        <span className="selected">Explain Code</span>
        <span>Generate Docs</span>
        <span>Generate README</span>
      </div>
    </div>
    <div className="ai-showcase-language" aria-hidden="true">
      JavaScript <span>⌄</span>
    </div>
    <div className="ai-showcase-code" aria-hidden="true">
      <span className="ai-showcase-line-numbers">01<br />02<br />03<br />04<br />05</span>
      <code>
        <span className="keyword">function</span> <span className="function">greet</span>(name) {"{"}
        <br />
        &nbsp;&nbsp;<span className="keyword">return</span> `Hello, ${"{name}"}`;
        <br />
        {"}"}
        <br />
        <br />
        <span className="comment">// Explain this code with AI</span>
      </code>
    </div>
    <div className="ai-showcase-submit" aria-hidden="true">
      Generate Explanation
    </div>
  </div>
);

export default AIShowcasePreview;

import { Editor } from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, language, readOnly = false }) {
  // Map our language names to Monaco language IDs
  const getMonacoLanguage = (lang) => {
    const languageMap = {
      'python': 'python',
      'c': 'c',
      'java': 'java',
    };
    return languageMap[lang] || 'python';
  };

  return (
    <div style={{ height: '100%', background: '#fff', border: '1px solid #e0e0e0' }}>
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={onChange}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: readOnly,
          wordWrap: 'on',
          fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
          lineHeight: 22,
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
}
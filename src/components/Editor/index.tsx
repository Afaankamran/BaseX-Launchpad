import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import { useCallback } from 'react';

const Editor = ({
  value,
  onChange,
  parsedData,
}: {
  value: any;
  onChange: any;
  parsedData: any;
}) => {
  const textAreaRef = useRef(null);
  const codeEditor = useRef(null);
  const handleChange = useCallback(
    (editor) => {
      if (onChange) onChange(editor.doc.getValue());
    },
    [onChange],
  );
  useEffect(() => {
    if (textAreaRef.current && !codeEditor.current) {
      codeEditor.current = CodeMirror.fromTextArea(textAreaRef.current, {
        value: value,
        lineNumbers: true,
      });
      codeEditor.current.on('change', handleChange);
    } else if (
      codeEditor.current &&
      codeEditor.current.doc.getValue().toString() !== value.toString()
    ) {
      codeEditor.current.doc.setValue(value);
    }
    if (codeEditor.current) {
      codeEditor.current.on('change', handleChange);
    }
    return () => {
      if (codeEditor.current) {
        codeEditor.current.off('change', handleChange);
      }
    };
  }, [textAreaRef, value, onChange, handleChange]);
  useEffect(() => {
    if (codeEditor.current) {
      for (let i = 0; i < codeEditor.current.doc.lineCount(); i++) {
        if (parsedData[i]?.hasError) {
          codeEditor.current.doc.addLineClass(i, 'wrap', 'errorLine');
        } else {
          codeEditor.current.doc.removeLineClass(i, 'wrap', 'errorLine');
        }
      }
    }
  }, [parsedData]);
  return <textarea ref={textAreaRef}></textarea>;
};
export default Editor;

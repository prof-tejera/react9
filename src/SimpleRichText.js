/**
 * QuillJS: https://quilljs.com/
 * React QuillJS: https://github.com/zenoamaro/react-quill
 */

import React, { useEffect } from 'react';
import { useQuill } from 'react-quilljs';

const RichText = ({ onChange }) => {
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (quill) {
      quill.on('text-change', delta => {
        console.log(delta);
        console.log(quill.root.innerHTML);
      });
    }
  }, [quill, onChange]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <div ref={quillRef} />
    </div>
  );
};

export default RichText;

import { useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

function DraftEditor({ onChange }) {
  const editorRef = useRef();

  const handleChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.getInstance().getHTML(); // HTML로 내용 가져오기
      onChange(content);
    }
  };

  return (
    <div>
      {/* ToastUI 에디터 */}
      <Editor
        ref={editorRef}
        initialValue=""
        previewStyle="vertical"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={false}
        toolbarItems={[
          ["heading", "bold", "italic", "strike"],
          ["hr", "quote"],
          ["ul", "ol", "task"],
          ["table", "link"],
        ]}
        onChange={handleChange}
      />

      {/* Cloudinary 업로드 위젯
      <div style={{ marginTop: "1rem"}}>
        <CloudinaryUploadWidget
          uploadImage={handleImageUpload}
        />
      </div> */}
    </div>
  );
}

export default DraftEditor;
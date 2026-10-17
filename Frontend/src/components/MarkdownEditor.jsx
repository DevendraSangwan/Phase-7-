import MDEditor from "@uiw/react-md-editor";

const MarkdownEditor = ({ value, onChange, theme, placeholder }) => {
  return (
    <div data-color-mode={theme}>
      <MDEditor
        value={value}
        onChange={onChange}
        height={200}
        preview="edit"
        hideToolbar
        textareaProps={{
          placeholder: placeholder || "Write your note here...",
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
import MDEditor from "@uiw/react-md-editor";

const MarkdownEditor = ({ value, onChange, theme }) => {
  return (
    <div data-color-mode={theme}>
      <MDEditor 
        value={value} 
        onChange={onChange}
        height={200}
        preview="edit"
      />
    </div>
  );
};

export default MarkdownEditor;
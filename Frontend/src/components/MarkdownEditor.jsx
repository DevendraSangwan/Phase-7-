import MDEditor from "@uiw/react-md-editor";

const MarkdownEditor = ({ value, onChange, placeholder }) => {
  return (
    <div data-color-mode="light">
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
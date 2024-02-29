import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { saveAs } from "file-saver";
import { RawOrParsedDelta, pdfExporter } from "quill-to-pdf";
import Quill from "quill";
import { useRef, useState } from "react";
import { downloadObjectAsJson } from "../utils/download";

export const QuillEditor: React.FC = () => {
  const toolbarOptions = [
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
    ["link", "image"],
    ["clean"], // remove formatting button
  ];

  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem("document") || "[]")
  );
  const editorRef = useRef<Quill | null>(null);

  const exportDocument = () => {
    const deltas = editorRef.current?.getContents();
    if (!deltas) {
      return alert("Content not found");
    }
    downloadObjectAsJson(deltas.ops, "editor-text");
  };

  const importDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    const Jsonfile = event.target.files?.[0];
    const reader = new FileReader();

    if (!Jsonfile) return;

    reader.readAsText(Jsonfile, "UTF-8");
    reader.onload = function (evt) {
      const delta = JSON.parse(evt.target?.result as string);
      editorRef.current?.setContents(delta);
    };
  };

  const exportAsPDF = async () => {
    const delta = editorRef.current?.getContents(); // gets the Quill delta
    const pdfAsBlob = await pdfExporter.generatePdf(delta as RawOrParsedDelta); // converts to PDF
    saveAs(pdfAsBlob, "pdf-export.pdf"); // downloads from the browser
  };

  const clearDocument = () => {
    editorRef.current?.deleteText(0, Infinity);
  };

  return (
    <div className="app">
      <main className="main-content">
        <div className="action-container">
          <button className="button" onClick={exportAsPDF}>
            Exportar como PDF
          </button>
          <button className="button" onClick={exportDocument}>
            Exportar como archivo
          </button>
          <input
            id="import-file"
            type="file"
            className="button"
            onChange={importDocument}
            title="Importar archivo"
            hidden={true}
          />
          <button className="button">
            <label
              style={{ height: "100%", width: "100%" }}
              htmlFor="import-file"
              className="custom-file-upload"
            >
              Importar archivo JSON
            </label>
          </button>
          <button className="button" onClick={clearDocument}>
            Limpiar documento
          </button>
        </div>
        <ReactQuill
          defaultValue={JSON.parse(localStorage.getItem("document") || "[]")}
          style={{ height: "60vh", width: "100%" }}
          theme="snow"
          value={value}
          onChange={(value) => setValue(value)}
          modules={{
            toolbar: toolbarOptions,
          }}
          ref={(ref) => {
            if (ref) {
              editorRef.current = ref.getEditor();
            }
          }}
        />
      </main>
    </div>
  );
};

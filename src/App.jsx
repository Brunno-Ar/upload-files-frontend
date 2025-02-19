import { useState, useEffect } from "react";
import { Menu, Trash } from "lucide-react";
import api from "./services/api";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [files, setFiles] = useState([]);
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await api.get("/files");
      setFiles(response.data);
    } catch (error) {
      console.error("Erro ao buscar arquivos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !fileName) {
      alert("Por favor, preencha o nome do arquivo e selecione um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    try {
      await api.post("/upload", formData);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      fetchFiles();
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${filename}"?`)) return;

    try {
      await api.delete(`/files/${filename}`);
      setDeleteMessage({ type: "success", text: "Arquivo excluído com sucesso!" });
      fetchFiles();
    } catch (error) {
      setDeleteMessage({ type: "error", text: error.message });
    }

    setTimeout(() => setDeleteMessage(null), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Menu lateral */}
      <div className={`transition-all duration-300 ${menuOpen ? "w-64" : "w-16"} bg-gray-800 p-5 overflow-y-auto max-h-screen`}>
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="bg-blue-500 p-2 rounded-lg hover:bg-blue-600 mb-4">
          <Menu size={24} />
        </button>
        {menuOpen && (
          <>
            <h2 className="text-xl font-bold mb-4">Arquivos Enviados</h2>
            <ul className="overflow-auto max-h-96">
              {files.length > 0 ? (
                files.map((file, index) => (
                  <li key={index} className="flex justify-between items-center mb-2 border-b border-gray-700 pb-2 px-2 py-1">
                    <span>{file.filename}</span>
                    <button
                      onClick={() => handleDelete(file.filename)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={18} />
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">Nenhum arquivo enviado.</p>
              )}
            </ul>
          </>
        )}
      </div>
      
      {/* Formulário de Upload */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
        >
          <h2 className="text-center text-xl font-bold mb-4">File Upload</h2>

          <input
            type="text"
            placeholder="Nome do arquivo"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full p-2 mb-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 mb-3 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer file:bg-blue-500 file:border-0 file:text-white file:px-4 file:py-2 file:rounded-md hover:file:bg-blue-600"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Enviar Arquivo
          </button>

          {uploadSuccess && (
            <p className="text-green-500 text-center mt-3">Arquivo enviado com sucesso!</p>
          )}
        </form>

        {deleteMessage && (
          <p className={`mt-4 ${deleteMessage.type === "success" ? "text-green-500" : "text-red-500"}`}>
            {deleteMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}

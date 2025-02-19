import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [files, setFiles] = useState([]);
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:3000/files");
      const data = await response.json();
      setFiles(data);
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
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Resposta do servidor:", result);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      fetchFiles(); // Atualiza a lista de arquivos após o upload
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Menu lateral */}
      {menuOpen && (
        <div className="w-64 bg-gray-800 p-5 overflow-y-auto max-h-screen">
          <h2 className="text-xl font-bold mb-4">Arquivos Enviados</h2>
          <ul className="overflow-auto max-h-96">
            {files.map((file, index) => (
              <li key={index} className="mb-2 border-b border-gray-700 pb-2 px-2 py-1">
                {file.filename}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Formulário de Upload */}
      <div className="flex-1 flex flex-col justify-center items-center relative">
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="absolute top-5 left-5 bg-blue-500 p-2 rounded-lg hover:bg-blue-600">
          <Menu size={24} />
        </button>
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
      </div>
    </div>
  );
}

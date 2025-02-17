import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function InvoiceUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;
    setUploading(true);
    setMessage("");

    const { data, error } = await supabase.storage
      .from("invoices")
      .upload(`invoices/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      setMessage("Error al subir la factura");
    } else {
      setMessage("Factura subida con éxito");
    }

    setUploading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Subir Factura</h2>
      <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={uploading} className="px-4 py-2 bg-blue-500 text-white rounded">
        {uploading ? "Subiendo..." : "Subir"}
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}

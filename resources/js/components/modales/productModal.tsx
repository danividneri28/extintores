//Modal para la creación de un producto con relacion a la categoría

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { router } from "@inertiajs/react";

interface Producto {
    id?: number;
    nombre: string;
    codigo_barras: string;
    descripcion: string;
    stock_minimo: number;
    precio: number;
    imagen?: string;
    categoria_id: number;
    categoria?: {
        nombre: string;
    };
}

interface Categoria {
    id: number;
    nombre: string;
}

interface Props {
    isOpen: boolean;
    closeModal: () => void;
    productos?: Producto | null;
    categorias: Categoria[];
}

export default function ProductModal({ isOpen, closeModal, productos, categorias }: Props) {

    const [formData, setFormData] = useState<Producto>({
        nombre: "",
        codigo_barras: "",
        descripcion: "",
        stock_minimo: 0,
        precio: 0,
        imagen: "",
        categoria_id: 0,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    useEffect(() => {
        if (productos) {
            setFormData({
                id: productos.id,
                nombre: productos.nombre,
                codigo_barras: productos.codigo_barras,
                descripcion: productos.descripcion,
                stock_minimo: productos.stock_minimo,
                precio: productos.precio,
                imagen: productos.imagen,
                categoria_id: productos.categoria_id,
            });
            setPreview(productos.imagen || "");
            setSelectedFile(null);
        } else {
            setFormData({
                nombre: "",
                codigo_barras: "",
                descripcion: "",
                stock_minimo: 0,
                precio: 0,
                imagen: "",
                categoria_id: 0,
            });
            setPreview("");
            setSelectedFile(null);
        }
    }, [productos]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "categoria_id" ? parseInt(value) : value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData();

        data.append("nombre", formData.nombre);
        data.append("codigo_barras", formData.codigo_barras);
        data.append("descripcion", formData.descripcion);
        data.append("stock_minimo", formData.stock_minimo.toString());
        data.append("precio", formData.precio.toString());
        data.append("categoria_id", formData.categoria_id.toString());

        if (selectedFile) {
            data.append("imagen", selectedFile);
        }

        if (productos?.id) {
            data.append("_method", "PUT");
            router.post(`/productos/${productos.id}`, data, {
                onSuccess: () => {
                    toast.success("Producto actualizado");
                    closeModal();
                    router.reload();
                },
                onError: () => {
                    toast.error("Error al actualizar el producto");
                    console.error("Error al actualizar el producto");
                }
            });
        } else {
            router.post("/productos", data, {
                onSuccess: () => {
                    toast.success("Producto creado");
                    closeModal();
                    router.reload();
                },
                onError: () => {
                    toast.error("Error al crear el producto");
                    console.error("Error al crear el producto");
                }
            });
        }
    };

    const inputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
    const labelStyle = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto dark:bg-neutral-900/50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md dark:bg-neutral-800">
                <h2 className="text-xl font-semibold mb-4">{productos ? "Editar" : "Crear"} Producto</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-4">
                        <label htmlFor="nombre" className={labelStyle}>Nombre</label>
                        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required
                            className={inputStyle} placeholder="Nombre" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="codigo_barras" className={labelStyle}>Código de Barras</label>
                        <input type="text" id="codigo_barras" name="codigo_barras" value={formData.codigo_barras} onChange={handleChange} required
                            className={inputStyle} placeholder="Código de Barras" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="descripcion" className={labelStyle}>Descripción</label>
                        <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} required
                            className={inputStyle} placeholder="Descripción" rows={4} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="stock_minimo" className={labelStyle}>Stock mínimo</label>
                        <input type="number" id="stock_minimo" name="stock_minimo" value={formData.stock_minimo} onChange={handleChange} required
                            className={inputStyle} placeholder="Stock mínimo" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="precio" className={labelStyle}>Precio</label>
                        <input type="number" id="precio" name="precio" value={formData.precio} onChange={handleChange} required
                            className={inputStyle} placeholder="Precio" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="categoria_id" className={labelStyle}>Categoría</label>
                        <select id="categoria_id" name="categoria_id" value={formData.categoria_id} onChange={handleChange} required
                            className={inputStyle}>
                            <option value="">Seleccionar categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="imagen" className={labelStyle}>Imagen</label>
                        <input type="file" id="imagen" name="imagen" accept="image/*" onChange={handleFileChange}
                            className={inputStyle} />
                        <div className="flex justify-center items-center">
                            {preview && (
                                <img src={preview} alt="Preview" className="mt-2 w-1/3 h-auto rounded-md" />
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-2">
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                            {productos ? "Actualizar" : "Crear"}
                        </button>
                        <button type="button" onClick={closeModal} className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}



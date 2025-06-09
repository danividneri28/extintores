import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Select from "react-select";

interface Inventario {
    id?: number;
    producto_id: number;
    producto?: {
        nombre: string;
    };
    stock: number;
}
interface Producto {
    id: number;
    nombre: string;
}
interface Props {
    isOpen: boolean;
    closeModal: () => void;
    inventarios?: Inventario | null;
    productos: Producto[];
}



export default function InventarioModal({ isOpen, closeModal, inventarios, productos }: Props) {
    const [formData, setFormData] = useState<Inventario>({
        id: 0,
        producto_id: 0,
        stock: 0,
    });

    useEffect(() => {
        if (inventarios) {
            setFormData({
                id: inventarios.id,
                producto_id: inventarios.producto_id,
                stock: inventarios.stock,
            });
        } else {
            setFormData({
                id: 0,
                producto_id: 0,
                stock: 0,
            });
        }
    }, [inventarios]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "producto_id" ? parseInt(value) : value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData();
        data.append("producto_id", formData.producto_id.toString());
        data.append("stock", formData.stock.toString());
        if (inventarios?.id) {
            data.append("_method", "PUT");
            router.post(`/inventarios/${inventarios.id}`, data, {
                onSuccess: () => {
                    toast.success("Inventario actualizado");
                    closeModal();
                    router.reload();
                },
                onError: () => {
                    toast.error("Error al actualizar el inventario");
                    console.error("Error al actualizar el inventario");
                }
            });
        } else {
            router.post("/inventarios", data, {
                onSuccess: () => {
                    toast.success("Inventario creado");
                    closeModal();
                    router.reload();
                },
                onError: () => {
                    toast.error("Error al crear el inventario");
                    console.error("Error al crear el inventario");
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
                <h2 className="text-xl font-semibold mb-4">Agregar Inventario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="producto_id" className={labelStyle}>Producto</label>
                        <select id="producto_id" name="producto_id" value={formData.producto_id} onChange={handleChange} required
                            className={inputStyle}>
                            <option value="">Seleccionar producto</option>
                            {productos.map((producto) => (
                                <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Stock" className={labelStyle}>Cantidad</label>
                        <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required
                            className={inputStyle} placeholder="cantidad" />
                    </div>

                    <div className="flex justify-between gap-2">
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                            Guardar
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

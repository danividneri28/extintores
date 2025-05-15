import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CategoriaModal from "@/components/modales/categorieModal";
import ProductoModal from "@/components/modales/productModal";
import Barcode from 'react-barcode';


export default function Productos() {

    const isDark = document.documentElement.classList.contains('dark');

    const muiTheme = createTheme({
        palette: {
            mode: isDark ? 'dark' : 'light',
        },
    });

    const { productos, categorias } = usePage<{
        productos: any[];
        categorias: any[];
    }>().props;


    const [isModalOpenProducts, setIsModalOpenProducts] = useState(false);
    const [isModalOpenCategories, setIsModalOpenCategories] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const openModalProducts = (producto = null) => {
        setSelectedProduct(producto);
        setIsModalOpenProducts(true);
    };

    const openModalCategories = (categoria = null) => {
        setSelectedCategory(categoria);
        setIsModalOpenCategories(true);
    };

    const handleDelete = (id: Number) => {
        router.delete(`/productos/${id}`, {
            onSuccess: () => {
                toast.success("Producto eliminado");
                router.reload();
            },
            onError: () => {
                toast.error("Error deleting post");
                console.error("Error deleting post");
            }
        });
    };

    const columns = [
        {
            field: 'imagen',
            headerName: 'Imagen',
            renderCell: (params) => (
                <img
                    src={params.value}
                    alt={params.value}
                    className="w-12 h-12 object-cover rounded"
                />
            ),
            sortable: false,
            width: 80,
        },
        { field: 'nombre', headerName: 'Producto', flex: 1 },
        {
            field: 'codigo_barras',
            headerName: 'Código de Barras',
            renderCell: (params) => (
                <div className="flex justify-center items-center py-1">

                    <Barcode
                        value={params.value}
                        width={1.0}
                        height={20}
                        displayValue={true}
                        fontSize={12}
                        margin={0}
                    />

                </div>
            ),
            flex: 1,
            sortable: false,
        },
        { field: 'categoria', headerName: 'Categoría', flex: 1 },
        { field: 'descripcion', headerName: 'Descripción', flex: 2 },
        { field: 'precio', headerName: 'Precio', flex: 1, type: 'number' },
        { field: 'stock_minimo', headerName: 'Stock Mínimo', flex: 1, type: 'number' },
        {
            field: 'actions',
            headerName: 'Acciones',
            sortable: false,
            renderCell: (params) => (
                <div className="flex justify-center items-center gap-2 py-2">
                    <button onClick={() => openModalProducts(params.row)} className="bg-blue-600 text-white rounded px-3 py-1 text-sm hover:bg-blue-700 transition">Editar</button>
                    <button onClick={() => handleDelete(params.row.id)} className="bg-red-600 text-white rounded px-3 py-1 text-sm hover:bg-red-700 transition">Eliminar</button>
                </div>
            ),
            width: 180,
        },
    ];

    const rows = productos.map((producto) => ({
        id: producto.id,
        imagen: producto.imagen, // Asegúrate de que esta propiedad exista
        nombre: producto.nombre,
        codigo_barras: producto.codigo_barras,
        categoria: producto.categoria?.nombre || "Sin categoría",
        descripcion: producto.descripcion,
        precio: "$" + producto.precio.toFixed(2),
        stock_minimo: producto.stock_minimo,
    }));

    return (
        <AppLayout>
            <Head title="Productos" />
            <Toaster position="top-right" richColors />
            <div className="flex flex-col gap-6 p-6 m-4 bg-white text-black shadow-lg rounded-xl dark:bg-neutral-900 dark:text-white">
                <div className="flex justify-end gap-4">
                    <button onClick={() => openModalCategories()} className="bg-blue-600 text-white rounded px-3 py-1 text-sm hover:bg-blue-700 transition">
                        + Categoría
                    </button>
                    <button onClick={() => openModalProducts()} className="bg-green-600 text-white rounded px-3 py-1 text-sm hover:bg-green-700 transition">
                        + Producto
                    </button>
                </div>

                <ThemeProvider theme={muiTheme}>
                    <CssBaseline />
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        pagination
                        disableSelectionOnClick
                    />
                </ThemeProvider>

                <CategoriaModal
                    isOpen={isModalOpenCategories}
                    closeModal={() => setIsModalOpenCategories(false)}
                    categorias={selectedCategory}
                />

                <ProductoModal
                    isOpen={isModalOpenProducts}
                    closeModal={() => setIsModalOpenProducts(false)}
                    productos={selectedProduct}
                    categorias={categorias}
                />
            </div>
        </AppLayout>
    )

}

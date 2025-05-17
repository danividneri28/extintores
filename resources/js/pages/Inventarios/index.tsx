import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import InventarioModal from "@/components/modales/inventarioModal";



export default function Inventarios() {

    const isDark = document.documentElement.classList.contains('dark');

    const muiTheme = createTheme({
        palette: {
            mode: isDark ? 'dark' : 'light',
        },
    });

    const { inventarios, productos } = usePage<{
        inventarios: any[];
        productos: any[];
    }>().props;


    const [isModalOpenInventarios, setIsModalOpenInventarios] = useState(false);
    const [selectedInventario, setSelectedInventario] = useState(null);


    const openModalInventarios = (inventario = null) => {
        setSelectedInventario(inventario);
        setIsModalOpenInventarios(true);
    };

    const columns = [

    ];

    const rows = inventarios.map((inventario) => ({

    }));

    return (
        <AppLayout>
            <Head title="Inventarios" />
            <Toaster position="top-right" richColors />
            <div className="flex flex-col gap-6 p-6 m-4 bg-white text-black shadow-lg rounded-xl dark:bg-neutral-900 dark:text-white">
                <div className="flex justify-end gap-4">
                    <button onClick={() => openModalInventarios()} className="bg-green-600 text-white rounded px-3 py-1 text-sm hover:bg-green-700 transition">
                        + Inventario
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

                <InventarioModal
                    isOpen={isModalOpenInventarios}
                    closeModal={() => setIsModalOpenInventarios(false)}
                    inventarios={selectedInventario}
                    productos={productos}
                />
            </div>
        </AppLayout>
    )

}

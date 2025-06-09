<?php

namespace App\Http\Controllers;

use App\Models\Inventario;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index():Response
    {
        $inventarios = Inventario::with('producto', 'producto.categoria')->get();
        $productos = Producto::all();

         return Inertia::render('Inventarios/index', [
            'inventarios' => $inventarios,
            'productos' => $productos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'stock' => 'required|integer|min:0',
        ]);

        // Check if the product already has an inventory entry
        $existingInventario = Inventario::where('producto_id', $request->producto_id)->first();
        if ($existingInventario) {
            Inventario::where('producto_id', $request->producto_id)->update([
                'stock' => $existingInventario->stock + $request->stock,
            ]);
        }
        else {
            Inventario::create([
                'producto_id' => $request->producto_id,
                'stock' => $request->stock,
            ]);
        }

        return redirect()->back()->with('success', 'Inventario creado con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Inventario $inventario)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Inventario $inventario)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inventario $inventario)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inventario $inventario)
    {
        //
    }
}

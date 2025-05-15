<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $productos = Producto::with('categoria')->get();
        $categorias = Categoria::all();

        return Inertia::render('Productos/index', [
            'productos' => $productos,
            'categorias' => $categorias,
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
            'nombre' => 'required|string|max:255',
            'codigo_barras' => 'required|string|unique:productos,codigo_barras',
            'stock_minimo' => 'required|numeric|min:0',
            'descripcion' => 'required|string',
            'stock_minimo' => 'required|numeric|min:0',
            'precio' => 'required|numeric|min:0',
            'imagen' => 'nullable|image|max:2048',
            'categoria_id' => 'required|exists:categorias,id',
        ]);

        $data = $request->only([
            'nombre',
            'codigo_barras',
            'stock_minimo',
            'descripcion',
            'stock_minimo',
            'precio',
            'categoria_id',
        ]);
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $fileName = time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('productos', $fileName, 'public');
            $data['imagen'] = '/storage/' . $path;
        }
        Producto::create($data);
        return redirect()->back()->with('success', 'Producto creado con éxito.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producto $producto)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo_barras' => 'required|string|unique:productos,codigo_barras,' . $producto->id,
            'stock_minimo' => 'required|numeric|min:0',
            'descripcion' => 'required|string',
            'stock_minimo' => 'required|numeric|min:0',
            'precio' => 'required|numeric|min:0',
            'imagen' => 'nullable|image|max:2048',
            'categoria_id' => 'required|exists:categorias,id',
        ]);

        $data = $request->only([
            'nombre',
            'codigo_barras',
            'stock_minimo',
            'descripcion',
            'stock_minimo',
            'precio',
            'categoria_id',
        ]);
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $fileName = time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('productos', $fileName, 'public');
            $data['imagen'] = '/storage/' . $path;
        }
        $producto->update($data);
        return redirect()->back()->with('success', 'Producto actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto)
    {
        $producto->delete();
        return redirect()->back()->with('success', 'Producto eliminado con éxito.');
    }
}

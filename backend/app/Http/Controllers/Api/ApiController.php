<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ApiController extends Controller
{
    //Register
    public function register(Request $request){

        $request->validate([
            "name" => "required|string",
            "email" => "required|email|unique:users,email",
            "password" => "required|confirmed",
            "biography" => "nullable|string",
            'preferences' => 'required|string',
            'image_url' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        // Guardar la imagen (si se ha enviado)
        $imagePath = null;
        if ($request->hasFile('image_url')) {
            $imagePath = $request->file('image_url')->store('perfiles', 'public');
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'biography' => $request->biography,
            'preferences' => $request->preferences,
            'image_url' => $imagePath ? asset('storage/' . $imagePath) : null, // Ruta accesible desde el frontend
        ]);
        
        return response()->json([
            "status" => true,
            "message" => "User registered succesfully"
        ]);
    }

    //Login
    public function login(Request $request){
        $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);
    
        // Buscar usuario por email
        $user = User::where("email", $request->email)->first();
    
        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                $token = $user->createToken("myToken")->plainTextToken;
                return response()->json([
                    "status" => true,
                    "message" => "Logged in successfully",
                    "token" => $token
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "La contraseña no coincide",
                ], 401);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "No existe usuario con ese email",
            ], 404);
        }
    }
    
    //Perfil
    public function profile(){

        $userdata = auth()->user();

        return response()->json([
            "status"=>true,
            "message"=>"Profile data",
            "data"=>$userdata
        ]);
    }
}

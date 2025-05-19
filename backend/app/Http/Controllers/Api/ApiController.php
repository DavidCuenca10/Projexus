<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

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

        $role = 'user';
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'biography' => $request->biography,
            'preferences' => $request->preferences,
            'image_url' => $imagePath ? 'storage/' . $imagePath : null,
            'role' => $role
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

    public function getAllUsers(){
        $users = User::all();

        return response()->json([
            "status" => true,
            "message" => "Users data",
            "data" => $users
        ]);
    }

    public function deleteUser($id){
        $user = User::find($id);

        if ($user->image_url) {
            // Eliminar el prefijo 'storage/' para que quede 'projects/xxxx...'
            $imagePath = str_replace('storage/', '', $user->image_url);

            // Eliminar archivo usando disco 'public'
            if (Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        if ($user) {
            $user->delete();
            return response()->json([
                'status' => true,
                'message' => 'Usuario eliminado correctamente',
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Usuario no encontrado',
            ], 404);
        }
    }
}

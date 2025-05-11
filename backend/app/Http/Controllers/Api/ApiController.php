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
            'preferences' => 'required|string'
        ]);

        if (empty($request->biography)) {
            $request->merge(['biography' => 'Hola soy']);
        }

        User::create($request->all());
        
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
                    "message" => "Password didn't match",
                ], 401);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "No account found with this email",
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

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;  // Importa Hash para usarlo
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
         User::updateOrCreate(
            ['email' => 'admin@admin.com'],  // Si ya existe un admin con este email, no lo crea
            [
                'name' => 'Administrador',
                'email' => 'admin@admin.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin'  // Asignamos el rol 'admin'
            ]
        );
    }
}

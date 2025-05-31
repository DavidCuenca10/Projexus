<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use Illuminate\Support\Facades\Hash;  // Importa Hash para usarlo
use Illuminate\Database\Seeder;

class UsersProjectsAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        $user1 = User::updateOrCreate(
            ['email' => 'david@gmail.com'],
            [
                'name' => 'David Cuenca',
                'password' => Hash::make('david123'),
                'role' => 'user',
                'biography' => '👋 Hola, soy David y me apasiona aprender y compartir conocimientos en mis áreas favoritas. ¡Encantado/a de estar aquí! 😊',
                'preferences' => 'Tecnologia',
                'image_url' => 'storage/perfiles/eJKgk9kBSZJlCZJRObOwBN3VicjTxUKFqSgWquRM.jpg',
            ]
        );

        $user2 = User::updateOrCreate(
            ['email' => 'maria@gmail.com'],
            [
                'name' => 'María Gómez',
                'password' => Hash::make('maria123'),
                'role' => 'user',
                'biography' => '👋 Hola, soy Maria y me apasiona aprender y compartir conocimientos en mis áreas favoritas. ¡Encantado/a de estar aquí! 😊',
                'preferences' => 'Musica',
                'image_url' => 'storage/perfiles/3fzSV7K9NYwNAFAho7GtozA8eL0lfFgBJJhnH7qd.jpg',
            ]
        );

        $user3 = User::updateOrCreate(
            ['email' => 'juan@gmail.com'],
            [
                'name' => 'Juan López',
                'password' => Hash::make('juan123'),
                'role' => 'user',
                'biography' => '👋 Hola, soy Juan y me apasiona aprender y compartir conocimientos en mis áreas favoritas. ¡Encantado/a de estar aquí! 😊',
                'preferences' => 'Marketing',
                'image_url' => 'storage/perfiles/d1e3d2a12bc3d0221898c4391dffcfff.jpg',
            ]
        );

        // Crear proyectos asociados
        $project1 = Project::create([
            'name' => 'Ecovida: Plataforma para Hábitos Sostenibles',
            'description' => 'Ecovida es una plataforma que promueve prácticas sostenibles mediante retos ecológicos, seguimiento de hábitos verdes y consejos diarios para cuidar el medio ambiente. Los usuarios pueden medir su impacto positivo y unirse a comunidades con intereses similares.',
            'category' => 'Negocios',
            'owner_id' => $user1->id,
            'current_members' => 1,
            'max_members' => 6,
            'estado' => 'activo',
            'tags' => 'Ecología,Sostenibilidad,Medioambiente',
            'image_url' => 'storage/projects/sostenibilidad-ry57zsgdeppjv7cp.jpg',
            'deadline' => '2025-09-01',
        ]);

        $project2 = Project::create([
            'name' => 'FitChallenge: Reta tus Límites',
            'description' => 'FitChallenge es una aplicación deportiva basada en desafíos semanales donde los usuarios pueden competir, registrar actividades físicas y alcanzar metas personales. Fomenta la vida activa a través de comunidad, estadísticas y recompensas digitales.',
            'category' => 'Deporte',
            'owner_id' => $user2->id,
            'current_members' => 1,
            'max_members' => 8,
            'estado' => 'activo',
            'tags' => 'Fitness,Retos,Actividad',
            'image_url' => 'storage/projects/fitness-muscular-man-rear-shot-o7hjg0p7g1afqd8t.jpg',
            'deadline' => '2025-09-20',
        ]);
        $project1->members()->attach($user1->id);
        $project2->members()->attach($user2->id);
    }
}

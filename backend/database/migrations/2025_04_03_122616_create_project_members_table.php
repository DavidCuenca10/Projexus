<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_members', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained('projects'); // Relación con projects
            $table->foreignId('user_id')->constrained('users'); // Relación con users
            $table->enum('role', ['owner', 'admin', 'member']);
            $table->enum('status', ['pending', 'accepted', 'rejected']);
            $table->primary(['project_id', 'user_id']); // Clave primaria compuesta
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_members');
    }
};

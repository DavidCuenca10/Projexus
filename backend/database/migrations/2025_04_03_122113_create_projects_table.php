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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('category');
            $table->foreignId('owner_id')->constrained('users'); // Clave foránea que hace referencia a users
            $table->integer('max_members');
            $table->integer('current_members')->default(0);
            $table->enum('estado', ['activo', 'completo'])->default('activo');
            $table->timestamp('deadline')->nullable();
            $table->text('tags')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

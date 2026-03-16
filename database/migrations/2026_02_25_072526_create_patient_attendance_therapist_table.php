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
        Schema::create('patient_attendance_therapist', function (Blueprint $table) {
            $table->foreignId('patient_attendance_id')->constrained('patient_attendances')->onDelete('cascade');
            $table->foreignId('therapist_id')->constrained('therapists')->onDelete('cascade');
            $table->primary(['patient_attendance_id', 'therapist_id'], 'pat_att_ther_primary'); // Shorter name
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_attendance_therapist');
    }
};

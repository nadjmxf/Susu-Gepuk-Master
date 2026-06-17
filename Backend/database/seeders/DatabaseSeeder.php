<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call(AdminSeeder::class);
        $this->call(RiderSeeder::class);
        $this->call(OutletSeeder::class);
        $this->call(LokasiBiSeeder::class);
        $this->call(MenuSeeder::class);
        $this->call(PenjualanSeeder::class);
        $this->call(AktivitasSeeder::class);
        $this->call(AnnouncementSeeder::class);
    }
}

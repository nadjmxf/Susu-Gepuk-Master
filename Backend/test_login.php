<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

$username = 'admin';
$password = 'password123';

$admin = Admin::where('username', $username)->first();
if (!$admin) {
    echo "Admin not found in DB\n";
    exit;
}

echo "Admin found: " . $admin->username . "\n";
echo "Hashed password in DB: " . $admin->password . "\n";

$check = Hash::check($password, $admin->password);
echo "Hash::check result: " . ($check ? "TRUE" : "FALSE") . "\n";

$check_bcrypt = password_verify($password, $admin->password);
echo "password_verify result: " . ($check_bcrypt ? "TRUE" : "FALSE") . "\n";

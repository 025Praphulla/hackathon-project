<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Add new user to the CSV file
    $user = [$username, $password, $email];
    $file = fopen("users.csv", "a");
    fputcsv($file, $user);
    fclose($file);

    header("Location: login.html"); // Redirect to login page after successful registration
    exit();
}
?>

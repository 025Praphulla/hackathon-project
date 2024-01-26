<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    // Check if the user exists
    if (checkUser($username, $password)) {
        $_SESSION["username"] = $username;
        header("Location: welcome.php"); // Redirect to welcome page after successful login
        exit();
    } else {
        echo "Invalid username or password.";
    }
}

function checkUser($username, $password) {
    $users = array_map("str_getcsv", file("users.csv"));
    foreach ($users as $user) {
        if ($user[0] == $username && $user[1] == $password) {
            return true;
        }
    }
    return false;
}
?>

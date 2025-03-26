<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Autoriser les méthodes POST
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Connexion à la base de données
$host = "localhost";
$db_name = "reservation_db";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur de connexion à la base de données"]);
    exit;
}

// Lire les données envoyées en JSON
$data = json_decode(file_get_contents("php://input"), true);

// Vérification des champs requis
if (
    isset($data['nom']) &&
    isset($data['prenom']) &&
    isset($data['email']) &&
    isset($data['motDePasse']) &&
    isset($data['role'])
) {
    // Récupérer les données
    $nom = htmlspecialchars(strip_tags($data['nom']));
    $prenom = htmlspecialchars(strip_tags($data['prenom']));
    $email = htmlspecialchars(strip_tags($data['email']));
    $motDePasse = password_hash($data['motDePasse'], PASSWORD_DEFAULT); // mot de passe haché
    $role = htmlspecialchars(strip_tags($data['role']));

    // Préparer la requête SQL
    $sql = "INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role) VALUES (:nom, :prenom, :email, :motDePasse, :role)";
    $stmt = $pdo->prepare($sql);

    // Exécuter la requête
    if ($stmt->execute([
        ':nom' => $nom,
        ':prenom' => $prenom,
        ':email' => $email,
        ':motDePasse' => $motDePasse,
        ':role' => $role
    ])) {
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Utilisateur inscrit avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de l'insertion"
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Champs requis manquants"]);
}
?>

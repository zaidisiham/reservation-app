<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
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
    echo json_encode(["status" => "error", "message" => "Erreur de connexion à la base de données"]);
    exit;
}

// Lire les données envoyées
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier les champs requis
if (!empty($data['email']) && !empty($data['motDePasse'])) {
    $email = htmlspecialchars(strip_tags($data['email']));
    $motDePasse = $data['motDePasse'];

    // Vérifier si l'utilisateur existe
    $sql = "SELECT * FROM utilisateurs WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $utilisateur = $stmt->fetch(PDO::FETCH_ASSOC);

        // Vérifier le mot de passe
        if (password_verify($motDePasse, $utilisateur['mot_de_passe'])) {
            echo json_encode([
                "status" => "success",
                "message" => "Connexion réussie",
                "user" => [
                    "id" => $utilisateur['id'],
                    "nom" => $utilisateur['nom'],
                    "prenom" => $utilisateur['prenom'],
                    "email" => $utilisateur['email'],
                    "role" => $utilisateur['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Mot de passe incorrect"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Utilisateur non trouvé"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Champs requis manquants"]);
}
?>

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

// Vérification des champs requis
if (!empty($data['email']) && !empty($data['ancienMotDePasse']) && !empty($data['nouveauMotDePasse'])) {
    $email = htmlspecialchars(strip_tags($data['email']));
    $ancienMotDePasse = $data['ancienMotDePasse'];
    $nouveauMotDePasse = $data['nouveauMotDePasse'];

    // Rechercher l'utilisateur
    $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = :email");
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $utilisateur = $stmt->fetch(PDO::FETCH_ASSOC);

        // Vérification de l'ancien mot de passe
        if (password_verify($ancienMotDePasse, $utilisateur['mot_de_passe'])) {
            // Hacher le nouveau mot de passe
            $motDePasseHashe = password_hash($nouveauMotDePasse, PASSWORD_DEFAULT);

            // Mise à jour dans la base de données
            $update = $pdo->prepare("UPDATE utilisateurs SET mot_de_passe = :mot_de_passe WHERE email = :email");
            $update->bindParam(":mot_de_passe", $motDePasseHashe);
            $update->bindParam(":email", $email);

            if ($update->execute()) {
                echo json_encode(["status" => "success", "message" => "Mot de passe mis à jour avec succès"]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Erreur lors de la mise à jour du mot de passe"]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Ancien mot de passe incorrect"]);
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

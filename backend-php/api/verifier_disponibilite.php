<?php
require_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$equipement_id = $data['equipement_id'];
$date_debut = $data['date_debut'];
$date_fin = $data['date_fin'];

try {
    $query = "
        SELECT * FROM reservations_equipements
        WHERE equipement_id = :equipement_id
        AND (
            (date_debut <= :date_fin AND date_fin >= :date_debut)
        )
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([
        'equipement_id' => $equipement_id,
        'date_debut' => $date_debut,
        'date_fin' => $date_fin,
    ]);

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($result) > 0) {
        echo json_encode(["disponible" => false]);
    } else {
        echo json_encode(["disponible" => true]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>

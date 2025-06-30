<?php
// Define o caminho do arquivo onde as avaliações serão salvas
$arquivo = 'avaliacoes.json';

// Lê o conteúdo do POST (esperando JSON)
$dados = json_decode(file_get_contents('php://input'), true);

if (!isset($dados['newsId']) || !isset($dados['nota'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Dados inválidos']);
    exit;
}

$newsId = $dados['newsId'];
$nota = (int) $dados['nota'];

// Carrega avaliações existentes (se houver)
$avaliacoes = [];
if (file_exists($arquivo)) {
    $avaliacoes = json_decode(file_get_contents($arquivo), true) ?? [];
}

// Atualiza dados
if (!isset($avaliacoes[$newsId])) {
    $avaliacoes[$newsId] = ['total' => 0, 'count' => 0];
}

$avaliacoes[$newsId]['total'] += $nota;
$avaliacoes[$newsId]['count']++;

// Salva novamente no arquivo
// Salva novamente no arquivo com bloqueio para evitar condições de corrida
if ($fp = fopen($arquivo, 'w')) {
    if (flock($fp, LOCK_EX)) {
        fwrite($fp, json_encode($avaliacoes, JSON_PRETTY_PRINT));
        fflush($fp);
        flock($fp, LOCK_UN);
    }
    fclose($fp);
} else {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha ao salvar avaliação']);
    exit;
}

// Retorna a média atualizada
$media = $avaliacoes[$newsId]['total'] / $avaliacoes[$newsId]['count'];
echo json_encode([
    'media' => round($media, 1),
    'total' => $avaliacoes[$newsId]['total'],
    'count' => $avaliacoes[$newsId]['count']
]);

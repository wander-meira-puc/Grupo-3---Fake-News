<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Verificar se é uma requisição POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método não permitido');
    }

    // Validar campos obrigatórios
    $titulo = trim($_POST['titulo'] ?? '');
    $descricao = trim($_POST['descricao'] ?? '');
    $autor = trim($_POST['autor'] ?? '');
    $tipo = trim($_POST['tipo'] ?? '');
    $link = trim($_POST['link'] ?? '#');

    if (empty($titulo)) {
        throw new Exception('Título é obrigatório');
    }

    if (empty($descricao)) {
        throw new Exception('Descrição é obrigatória');
    }

    if (empty($autor)) {
        throw new Exception('Nome do autor é obrigatório');
    }

    if (empty($tipo) || !in_array($tipo, ['FAKE', 'TRUE'])) {
        throw new Exception('Tipo de verificação é obrigatório');
    }

    // Processar upload da imagem
    if (!isset($_FILES['imagem']) || $_FILES['imagem']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Imagem é obrigatória');
    }

    $arquivo = $_FILES['imagem'];
    $nomeOriginal = $arquivo['name'];
    $tamanho = $arquivo['size'];
    $tipoMime = $arquivo['type'];
    $arquivoTmp = $arquivo['tmp_name'];

    // Validar tipo de arquivo
    $tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!in_array($tipoMime, $tiposPermitidos)) {
        throw new Exception('Formato de imagem não suportado. Use JPG, PNG, WEBP ou AVIF.');
    }

    // Validação adicional: verificar se realmente é uma imagem
    $infoImagem = getimagesize($arquivoTmp);
    if ($infoImagem === false) {
        throw new Exception('Arquivo não é uma imagem válida.');
    }

    // Validar tamanho (máximo 5MB)
    if ($tamanho > 5 * 1024 * 1024) {
        throw new Exception('Imagem muito grande. Tamanho máximo: 5MB');
    }

    // Gerar nome único para o arquivo
    $extensao = pathinfo($nomeOriginal, PATHINFO_EXTENSION);
    $nomeArquivo = 'noticia_' . time() . '_' . rand(1000, 9999) . '.' . $extensao;
    
    // Definir caminho de destino (relativo ao arquivo PHP)
    $pastaDestino = '../imgs/';
    $caminhoCompleto = $pastaDestino . $nomeArquivo;
    $caminhoParaJson = '../imgs/' . $nomeArquivo;

    // Criar pasta se não existir
    if (!is_dir($pastaDestino)) {
        if (!mkdir($pastaDestino, 0755, true)) {
            throw new Exception('Erro ao criar pasta de imagens');
        }
    }

    // Mover arquivo para pasta de destino
    if (!move_uploaded_file($arquivoTmp, $caminhoCompleto)) {
        throw new Exception('Erro ao salvar imagem no servidor');
    }

    // Ler o arquivo JSON atual
    $jsonFile = 'noticias.json';
    if (!file_exists($jsonFile)) {
        throw new Exception('Arquivo de notícias não encontrado');
    }

    $jsonContent = file_get_contents($jsonFile);
    $noticias = json_decode($jsonContent, true);

    if ($noticias === null) {
        throw new Exception('Erro ao ler arquivo de notícias');
    }

    // Gerar novo ID (maior ID existente + 1)
    $novoId = 1;
    foreach ($noticias as $noticia) {
        if (isset($noticia['id']) && $noticia['id'] >= $novoId) {
            $novoId = $noticia['id'] + 1;
        }
    }

    // Criar nova notícia
    $novaNoticia = [
        'id' => $novoId,
        'titulo' => $titulo,
        'imagem' => $caminhoParaJson,
        'descricao' => $descricao,
        'autor' => $autor,
        'tipo' => $tipo,
        'link' => $link
    ];

    // Adicionar no início do array para aparecer primeiro
    array_unshift($noticias, $novaNoticia);

    // Salvar de volta no arquivo JSON
    $jsonAtualizado = json_encode($noticias, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if (file_put_contents($jsonFile, $jsonAtualizado) === false) {
        throw new Exception('Erro ao salvar notícia');
    }

    // Resposta de sucesso
    echo json_encode([
        'success' => true,
        'message' => 'Notícia cadastrada com sucesso! Redirecionando...',
        'id' => $novoId
    ]);

} catch (Exception $e) {
    // Resposta de erro
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 
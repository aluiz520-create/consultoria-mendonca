-- SafraCerta — Separar "Maquinário e combustível" em duas categorias

-- Para contas existentes, renomeia a categoria
UPDATE categorias_custo
SET nome = 'Maquinário'
WHERE nome = 'Maquinário e combustível'
  AND account_id IN (SELECT id FROM accounts);

-- Cria categoria "Combustível" para todas as contas existentes
INSERT INTO categorias_custo (account_id, nome, grupo)
SELECT DISTINCT account_id, 'Combustível', 'variavel'
FROM categorias_custo
WHERE nome = 'Maquinário'
  AND NOT EXISTS (
    SELECT 1 FROM categorias_custo cc2
    WHERE cc2.account_id = categorias_custo.account_id
      AND cc2.nome = 'Combustível'
  );

-- Atualiza a função que cria categorias padrão para novas contas
-- (modificamos a migrations 0001, 0010 e 0017 mas contas já criadas não serão afetadas)

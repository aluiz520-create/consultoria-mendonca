-- SafraCerta — dados de cobranca (Asaas)

alter table accounts add column cpf_cnpj text;
alter table accounts add column email_cobranca text;

alter table assinaturas add column asaas_customer_id text;

-- status possiveis a partir de agora: trial | pendente | ativa | atrasada | cancelada

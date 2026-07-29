-- SafraCerta — controle de fluxo de pagamento das despesas

alter table lancamentos_custo add column data_vencimento date;
alter table lancamentos_custo add column data_pagamento date;

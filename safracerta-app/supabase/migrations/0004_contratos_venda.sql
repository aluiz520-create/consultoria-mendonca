-- SafraCerta — contratos de venda de producao (comercializacao da safra)

create table contratos_venda (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  safra_id uuid references safras (id) on delete set null,
  comprador_nome text not null,
  cultura text,
  quantidade numeric not null check (quantidade > 0),
  unidade_medida text not null default 'saca', -- saca | tonelada | kg
  preco_unitario numeric not null check (preco_unitario > 0),
  valor_total numeric generated always as (quantidade * preco_unitario) stored,
  forma_pagamento text, -- a_vista | prazo | barter
  data_contrato date not null default current_date,
  data_entrega date,
  status text not null default 'firmado', -- firmado | entregue | cancelado
  observacoes text,
  created_by uuid references users (id),
  created_at timestamptz not null default now()
);

alter table contratos_venda enable row level security;

create policy "contratos_venda: crud na propria conta" on contratos_venda
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create trigger trg_auditoria_contratos_venda
  after insert or update or delete on contratos_venda
  for each row execute procedure public.registrar_auditoria();

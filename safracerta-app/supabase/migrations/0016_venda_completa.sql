-- SafraCerta — Venda completa
--
-- Cadastro de clientes (reutilizavel entre contratos), frete e desconto no
-- contrato de venda (formando o valor liquido) e recebimentos parciais
-- (varios pagamentos do mesmo contrato ao longo do tempo).

create table clientes (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  nome text not null,
  documento text,
  telefone text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table clientes enable row level security;

create policy "clientes: crud na propria conta" on clientes
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create trigger trg_auditoria_clientes
  after insert or update or delete on clientes
  for each row execute procedure public.registrar_auditoria();

alter table contratos_venda add column cliente_id uuid references clientes (id) on delete set null;
alter table contratos_venda add column frete numeric not null default 0;
alter table contratos_venda add column desconto numeric not null default 0;
alter table contratos_venda add column valor_liquido numeric generated always as (quantidade * preco_unitario - frete - desconto) stored;

create table recebimentos_venda (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  contrato_venda_id uuid not null references contratos_venda (id) on delete cascade,
  valor numeric not null check (valor > 0),
  data date not null default current_date,
  forma_pagamento text,
  observacoes text,
  created_by uuid references users (id),
  created_at timestamptz not null default now()
);

alter table recebimentos_venda enable row level security;

create policy "recebimentos_venda: crud na propria conta" on recebimentos_venda
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create trigger trg_auditoria_recebimentos_venda
  after insert or update or delete on recebimentos_venda
  for each row execute procedure public.registrar_auditoria();

-- SafraCerta — Operacoes agricolas por talhao (plantio)
--
-- Uma operacao agricola (plantio, adubacao, pulverizacao, colheita...)
-- registra o que foi feito: funcionario, maquina, implemento, horas e os
-- produtos de estoque usados. Ao salvar, gera automaticamente:
-- 1) saida no estoque de cada produto usado (valida saldo disponivel)
-- 2) custo de mao de obra (horas x custo_hora do funcionario)
-- 3) custo de maquinario (horas x custo_hora da maquina)
-- 4) custo dos produtos consumidos (quantidade x custo medio do produto)
-- O usuario nunca lanca estoque ou custo separadamente.

create table operacoes_agricolas (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  plantio_id uuid not null references plantios (id) on delete restrict,
  tipo text not null, -- plantio | adubacao | pulverizacao | cultivo | irrigacao | colheita | outro
  data date not null default current_date,
  area_executada_ha numeric,
  funcionario_id uuid references funcionarios (id) on delete set null,
  maquina_id uuid references maquinas (id) on delete set null,
  implemento_id uuid references implementos (id) on delete set null,
  horas numeric,
  observacoes text,
  created_by uuid references users (id),
  created_at timestamptz not null default now()
);

create table operacao_produtos (
  id uuid primary key default gen_random_uuid(),
  operacao_id uuid not null references operacoes_agricolas (id) on delete cascade,
  produto_id uuid not null references produtos_estoque (id) on delete restrict,
  quantidade numeric not null check (quantidade > 0),
  preco_unitario numeric not null default 0,
  valor_total numeric generated always as (quantidade * preco_unitario) stored
);

alter table operacoes_agricolas enable row level security;
alter table operacao_produtos enable row level security;

create policy "operacoes_agricolas: crud na propria conta" on operacoes_agricolas
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create policy "operacao_produtos: crud via operacao da propria conta" on operacao_produtos
  for all using (
    operacao_id in (select id from operacoes_agricolas where account_id = public.current_account_id())
  )
  with check (
    operacao_id in (select id from operacoes_agricolas where account_id = public.current_account_id())
  );

create trigger trg_auditoria_operacoes_agricolas
  after insert or update or delete on operacoes_agricolas
  for each row execute procedure public.registrar_auditoria();

-- ao apagar uma operacao, desfaz a saida de estoque e os custos gerados por ela
alter table estoque_movimentacoes add column operacao_id uuid references operacoes_agricolas (id) on delete cascade;
alter table lancamentos_custo add column operacao_id uuid references operacoes_agricolas (id) on delete cascade;

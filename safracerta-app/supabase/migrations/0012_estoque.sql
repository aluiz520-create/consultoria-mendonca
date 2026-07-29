-- SafraCerta — Estoque (produtos + movimentacoes)
--
-- Todo produto entra primeiro no estoque; toda saida (por compra manual
-- ou, depois, por Compra/Operacao automatizada) baixa o saldo. A API
-- impede lancar saida maior que o saldo disponivel.

create table produtos_estoque (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  nome text not null,
  categoria text not null default 'outros', -- sementes | fertilizantes | defensivos | combustiveis | lubrificantes | pecas | epis | materiais | outros
  unidade_medida text not null default 'un', -- kg | l | saca | ton | un
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table estoque_movimentacoes (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  produto_id uuid not null references produtos_estoque (id) on delete cascade,
  tipo text not null, -- entrada | saida
  quantidade numeric not null check (quantidade > 0),
  preco_unitario numeric,
  data date not null default current_date,
  talhao_id uuid references talhoes (id) on delete set null,
  observacao text,
  created_by uuid references users (id),
  created_at timestamptz not null default now()
);

alter table produtos_estoque enable row level security;
alter table estoque_movimentacoes enable row level security;

create policy "produtos_estoque: crud na propria conta" on produtos_estoque
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create policy "estoque_movimentacoes: crud na propria conta" on estoque_movimentacoes
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create trigger trg_auditoria_produtos_estoque
  after insert or update or delete on produtos_estoque
  for each row execute procedure public.registrar_auditoria();

create trigger trg_auditoria_estoque_movimentacoes
  after insert or update or delete on estoque_movimentacoes
  for each row execute procedure public.registrar_auditoria();

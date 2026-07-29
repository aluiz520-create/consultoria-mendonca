-- SafraCerta — cadastros base para as Operacoes agricolas (Etapa 5):
-- Funcionarios, Maquinas e Implementos.

create table funcionarios (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  nome text not null,
  funcao text,
  custo_hora numeric,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table maquinas (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  nome text not null,
  tipo text, -- trator | colheitadeira | pulverizador | plantadeira | distribuidor | caminhao | outro
  custo_hora numeric,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table implementos (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  nome text not null,
  tipo text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table funcionarios enable row level security;
alter table maquinas enable row level security;
alter table implementos enable row level security;

create policy "funcionarios: crud na propria conta" on funcionarios
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create policy "maquinas: crud na propria conta" on maquinas
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create policy "implementos: crud na propria conta" on implementos
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create trigger trg_auditoria_funcionarios
  after insert or update or delete on funcionarios
  for each row execute procedure public.registrar_auditoria();

create trigger trg_auditoria_maquinas
  after insert or update or delete on maquinas
  for each row execute procedure public.registrar_auditoria();

create trigger trg_auditoria_implementos
  after insert or update or delete on implementos
  for each row execute procedure public.registrar_auditoria();

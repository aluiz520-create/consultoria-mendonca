-- SafraCerta — Centro de Resultado
--
-- Cada custo e cada receita passam a pertencer a um Centro de Resultado
-- (Produção, Administrativo, Máquinas, Comercial). Para nao pedir a mesma
-- informacao duas vezes, o centro e herdado automaticamente da categoria
-- de custo ja escolhida (ou da natureza da receita) — sem campo novo nos
-- formularios.

create table centros_resultado (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  nome text not null,
  created_at timestamptz not null default now(),
  unique (account_id, nome)
);

alter table centros_resultado enable row level security;

create policy "centros_resultado: crud na propria conta" on centros_resultado
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create trigger trg_auditoria_centros_resultado
  after insert or update or delete on centros_resultado
  for each row execute procedure public.registrar_auditoria();

alter table categorias_custo add column centro_resultado_id uuid references centros_resultado (id) on delete set null;
alter table lancamentos_custo add column centro_resultado_id uuid references centros_resultado (id) on delete set null;
alter table contratos_venda add column centro_resultado_id uuid references centros_resultado (id) on delete set null;

-- cria os 4 centros padrao para cada conta ja existente
insert into centros_resultado (account_id, nome)
select id, 'Produção' from accounts
union all
select id, 'Administrativo' from accounts
union all
select id, 'Máquinas' from accounts
union all
select id, 'Comercial' from accounts
on conflict (account_id, nome) do nothing;

-- associa as categorias ja existentes ao centro correspondente
update categorias_custo cc
set centro_resultado_id = cr.id
from centros_resultado cr
where cr.account_id = cc.account_id
  and (
    (cc.nome ilike '%insumo%' and cr.nome = 'Produção')
    or (cc.nome ilike '%mão de obra%' and cr.nome = 'Produção')
    or (cc.nome ilike '%maquinário%' and cr.nome = 'Máquinas')
    or (cc.nome ilike '%arrendamento%' and cr.nome = 'Administrativo')
    or (cc.nome ilike '%administrativo%' and cr.nome = 'Administrativo')
  );

-- para categorias que nao bateram em nenhuma regra acima, cai em "Produção"
update categorias_custo cc
set centro_resultado_id = cr.id
from centros_resultado cr
where cr.account_id = cc.account_id
  and cr.nome = 'Produção'
  and cc.centro_resultado_id is null;

-- lancamentos e contratos de venda ja existentes herdam o centro da categoria/producao
update lancamentos_custo lc
set centro_resultado_id = cc.centro_resultado_id
from categorias_custo cc
where cc.id = lc.categoria_id;

update contratos_venda cv
set centro_resultado_id = cr.id
from centros_resultado cr
where cr.account_id = cv.account_id
  and cr.nome = 'Comercial';

-- estende o cadastro automatico de novas contas para ja criar os centros
-- e vincular as categorias padrao ao centro certo
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_account_id uuid;
  cr_producao_id uuid;
  cr_administrativo_id uuid;
  cr_maquinas_id uuid;
begin
  insert into accounts (nome)
  values (coalesce(new.raw_user_meta_data ->> 'nome_conta', 'Minha Fazenda'))
  returning id into new_account_id;

  insert into users (id, account_id, nome, papel)
  values (new.id, new_account_id, new.raw_user_meta_data ->> 'nome', 'owner');

  insert into assinaturas (account_id, plano, status)
  values (new_account_id, 'starter', 'trial');

  insert into centros_resultado (account_id, nome) values (new_account_id, 'Produção') returning id into cr_producao_id;
  insert into centros_resultado (account_id, nome) values (new_account_id, 'Administrativo') returning id into cr_administrativo_id;
  insert into centros_resultado (account_id, nome) values (new_account_id, 'Máquinas') returning id into cr_maquinas_id;
  insert into centros_resultado (account_id, nome) values (new_account_id, 'Comercial');

  insert into categorias_custo (account_id, nome, grupo, centro_resultado_id) values
    (new_account_id, 'Insumos (sementes, fertilizante, defensivo)', 'variavel', cr_producao_id),
    (new_account_id, 'Mão de obra', 'variavel', cr_producao_id),
    (new_account_id, 'Maquinário', 'variavel', cr_maquinas_id),
    (new_account_id, 'Combustível', 'variavel', cr_maquinas_id),
    (new_account_id, 'Arrendamento', 'fixo', cr_administrativo_id),
    (new_account_id, 'Administrativo', 'fixo', cr_administrativo_id);

  return new;
end;
$$;

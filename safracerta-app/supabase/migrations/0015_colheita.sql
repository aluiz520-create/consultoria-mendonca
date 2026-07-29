-- SafraCerta — Colheita completa
--
-- Antes, a colheita era um unico valor manual (sacas + umidade) no plantio.
-- Agora cada carga entregue no armazem fica registrada (peso liquido,
-- umidade, armazem, data), e o total do plantio (usado no dashboard e no
-- custo/saca) e recalculado sozinho a partir da soma das cargas — sem
-- nenhuma outra tela precisar mudar.

create table armazens (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  nome text not null,
  localizacao text,
  created_at timestamptz not null default now()
);

alter table armazens enable row level security;

create policy "armazens: crud na propria conta" on armazens
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create trigger trg_auditoria_armazens
  after insert or update or delete on armazens
  for each row execute procedure public.registrar_auditoria();

create table colheitas (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  plantio_id uuid not null references plantios (id) on delete cascade,
  armazem_id uuid references armazens (id) on delete set null,
  data date not null default current_date,
  peso_liquido_kg numeric not null check (peso_liquido_kg > 0),
  umidade numeric,
  sacas numeric generated always as (peso_liquido_kg / 60) stored, -- saca padrao de 60kg
  observacoes text,
  created_by uuid references users (id),
  created_at timestamptz not null default now()
);

alter table colheitas enable row level security;

create policy "colheitas: crud na propria conta" on colheitas
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create trigger trg_auditoria_colheitas
  after insert or update or delete on colheitas
  for each row execute procedure public.registrar_auditoria();

-- mantem plantios.producao_colhida_sc e umidade_colheita como o total/media
-- das cargas de colheita registradas
create or replace function public.recalcular_producao_colhida()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_plantio_id uuid := coalesce(new.plantio_id, old.plantio_id);
  v_total_sacas numeric;
  v_umidade_media numeric;
begin
  select
    coalesce(sum(sacas), 0),
    case when sum(peso_liquido_kg) > 0 then sum(umidade * peso_liquido_kg) / sum(peso_liquido_kg) else null end
  into v_total_sacas, v_umidade_media
  from colheitas
  where plantio_id = v_plantio_id;

  update plantios
  set producao_colhida_sc = nullif(v_total_sacas, 0),
      umidade_colheita = v_umidade_media
  where id = v_plantio_id;

  return coalesce(new, old);
end;
$$;

create trigger trg_recalcular_producao_colhida
  after insert or update or delete on colheitas
  for each row execute procedure public.recalcular_producao_colhida();

-- migra o registro manual ja existente (sacas + umidade no plantio) para uma
-- carga de colheita, sem perder o que ja foi lancado
insert into colheitas (account_id, plantio_id, data, peso_liquido_kg, umidade, observacoes)
select f.account_id, p.id, current_date, p.producao_colhida_sc * 60, p.umidade_colheita, 'Migrado do registro anterior de colheita'
from plantios p
join talhoes t on t.id = p.talhao_id
join fazendas f on f.id = t.fazenda_id
where p.producao_colhida_sc is not null and p.producao_colhida_sc > 0;

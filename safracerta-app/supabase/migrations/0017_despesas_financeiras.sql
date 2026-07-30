-- SafraCerta — Resultado/DRE completo
--
-- O DRE (Etapa 8) agrupa os lancamentos_custo ja existentes por natureza
-- (operacional, administrativo, arrendamento, financeiro) sem exigir nenhum
-- campo novo — exceto uma categoria "Despesas financeiras" que ainda nao
-- existia (juros, tarifas bancarias, IOF...), adicionada aqui para quem
-- precisar lancar isso.

insert into categorias_custo (account_id, nome, grupo, centro_resultado_id)
select a.id, 'Despesas financeiras', 'fixo', cr.id
from accounts a
join centros_resultado cr on cr.account_id = a.id and cr.nome = 'Administrativo'
where not exists (
  select 1 from categorias_custo cc where cc.account_id = a.id and cc.nome ilike '%despesa%financeir%'
);

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
    (new_account_id, 'Administrativo', 'fixo', cr_administrativo_id),
    (new_account_id, 'Despesas financeiras', 'fixo', cr_administrativo_id);

  return new;
end;
$$;

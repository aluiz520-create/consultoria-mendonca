# PAINEL DE CONTROLE — Para onde foi meu dinheiro?

**Última leitura:** 08/08/2026
**Fontes:** GA4 propriedade 546920453 (via Windsor.ai) · extrato Kiwify (manual)

> `não medido` = ainda não existe instrumento para esse número.
> `0` = existe instrumento e o valor medido foi zero.
> A diferença entre os dois é a coisa mais importante deste painel.

---

## TRÁFEGO

| Métrica | Site do dinheiro | Site da consultoria |
|---|---|---|
| Visitantes hoje | não medido | não medido |
| Visitantes 7 dias | **0** ¹ | 5 |
| Visitantes 30 dias | **0** ¹ | 5 |
| Páginas vistas 30 dias | **0** ¹ | 25 |

¹ Zero real, e a explicação está no relatório: até 08/08/2026 a pasta `/site-dinheiro/` não
tinha tag de medição **e** não tinha nenhum link de entrada. A partir de hoje, os dois
problemas estão corrigidos — a próxima leitura vale como linha de base de verdade.

### Origem do tráfego (30 dias, domínio inteiro)

| Canal | Sessões | Usuários |
|---|---|---|
| Organic Social (Instagram) | 5 | 2 |
| Unassigned | 3 | 2 |
| Direct | 1 | 1 |
| **Google (orgânico)** | **0** | **0** |
| TikTok | 0 | 0 |
| Facebook | 0 | 0 |

**Leitura:** o domínio inteiro tem 1 dia de histórico (GA4 ligado em 07/08). Nenhum tráfego
de busca ainda — esperado, e é exatamente o que este trabalho existe para mudar.

---

## SEO

| Métrica | Valor |
|---|---|
| Impressões | não medido |
| Cliques | não medido |
| CTR | não medido |
| Posição média | não medido |
| Consultas | não medido |
| Páginas indexadas | não medido |
| Erros de indexação | não medido |

**Todos dependem do Google Search Console**, que ainda não foi ligado. Passo a passo de 15
minutos em [`SEARCH-CONSOLE.md`](SEARCH-CONSOLE.md). É o item que mais muda a qualidade das
decisões a partir da semana 2.

Já está pronto do lado do site: sitemap com as 6 URLs, canonical em todas as páginas, 0 links
quebrados, 0 páginas órfãs.

---

## CONVERSÃO

| Degrau | Evento | Valor |
|---|---|---|
| Visitas | `page_view` | 0 ¹ |
| Começaram o diagnóstico | `comecou_diagnostico` | 0 ¹ |
| Completaram o diagnóstico | `diagnostico_pronto` | 0 ¹ |
| Usaram a calculadora de dívidas | `plano_dividas_pronto` | 0 ¹ |
| Usaram a calculadora do rotativo | `rotativo_calculado` | 0 ¹ |
| Usaram os tetos por renda | `tetos_calculados` | 0 ¹ |
| Compartilharam | `compartilhou` + `copiou_*` | 0 ¹ |
| Clicaram na oferta | `clique_plano` | 0 ¹ |
| **Compraram** | extrato Kiwify | **0** ² |
| Receita | extrato Kiwify | **R$ 0** ² |

¹ Eventos instalados hoje. A primeira leitura com valor real será na próxima sessão.
² Zero confirmado. **Nenhum número de venda entra neste painel sem confirmação no extrato da
Kiwify ou no Pix.** Não haverá venda estimada, projetada ou "provável" em lugar nenhum.

### As três taxas que decidem o projeto

| Taxa | Fórmula | Meta | Hoje |
|---|---|---|---|
| Visita → uso | `diagnostico_pronto` ÷ `page_view` | > 20% | não medido |
| Uso → clique na oferta | `clique_plano` ÷ usos | > 2% | não medido |
| Clique → compra | vendas ÷ `clique_plano` | > 5% | não medido |

**Como ler quando houver dado** (Fase 14):
- Primeira taxa baixa → o problema é a página, não o tráfego. Não adianta trazer mais gente.
- Segunda taxa baixa → o problema é a oferta ou o momento em que ela aparece.
- Terceira taxa baixa → o problema é o checkout ou o preço.

Trazer mais tráfego para um funil furado só aumenta o desperdício. Por isso a ordem de
diagnóstico é sempre de baixo para cima.

---

## CONTEÚDO

| Métrica | Valor |
|---|---|
| Páginas publicadas | **6** (2 antes de hoje, 4 novas) |
| Conteúdos sociais escritos | **30** + 20 ganchos + 12 títulos + 9 CTAs |
| Conteúdos sociais publicados | **0** — depende do proprietário |
| Melhor conteúdo | não medido |
| Pior conteúdo | não medido |
| Conteúdo que gerou venda | não medido |

### Páginas no ar

| Página | Ferramenta dentro? | Publicada |
|---|---|---|
| `/site-dinheiro/` | ✅ diagnóstico da casa | antes |
| `/quanto-precisa-ganhar/` | tabela | antes |
| `/qual-divida-pagar-primeiro/` | ✅ avalanche × bola de neve | 08/08 |
| `/juros-do-cartao-de-credito/` | ✅ rotativo 3/6/12 meses | 08/08 |
| `/quanto-posso-gastar-ganhando/` | ✅ tetos por faixa | 08/08 |
| `/como-sair-das-dividas/` | pilar | 08/08 |

---

## Saúde técnica

| Checagem | Resultado |
|---|---|
| Links internos quebrados | **0** |
| Páginas órfãs | **0** |
| Páginas com canonical | 6 de 6 |
| Páginas com Open Graph completo | 6 de 6 |
| Páginas no sitemap da raiz | 6 de 6 |
| Páginas com dados estruturados | 6 de 6 |
| Erro de sintaxe em JS | **0** |
| Calculadoras testadas em navegador real | 4 de 4 ✅ |

---

## Como atualizar este painel

Os números de tráfego e conversão vêm do GA4 e são lidos por consulta direta — não precisam de
trabalho manual seu. Os de SEO passam a existir quando o Search Console for ligado. Os de
venda dependem de você conferir o extrato da Kiwify e me dizer.

**A cada ciclo de trabalho eu releio o painel antes de decidir o que fazer.** É ele que separa
"achei que funcionou" de "funcionou".

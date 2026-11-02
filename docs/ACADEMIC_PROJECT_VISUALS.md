# Academic project images: source provenance and regeneration handoff

## Scope

This image-only content pass replaces shared generic preview art in exactly nine
academic-course project records with **nine 1200 × 675 landscape card assets**
and **nine 794 × 1123 portrait A4-proportion detail assets**. Every asset is
an editable SVG committed to `assets/img/portfolio/`. Every project page
references both `image` and `detail_image`, with separate alt text.

The **detail images are visually designed first-page *overviews***, not purported
screenshots of the original PDF/notebook's first page. This distinction is
written on the images. Original PDFs, HTML reports, DOCX documents, and notebooks
remain linked through their existing `resource_url` / `github` metadata.
**Do not describe the generated visual reconstructions as document scans.**

## Source map

| Course project | Evidence / original source | Card visualization |
| --- | --- | --- |
| S&P 500 Supply-Chain Network | [Executed network notebook](https://github.com/heri-espino/LDS1121-Complex-Networks/blob/main/notebooks/18%20Prediccion%20de%20Enlaces/03%20SP500.ipynb) | Actual executed Adamic–Adar graph SVG embedded in the card, with its project metrics |
| Star Wars Link Prediction | [Executed link-prediction notebook](https://github.com/heri-espino/LDS1121-Complex-Networks/blob/main/notebooks/18%20Prediccion%20de%20Enlaces/02%20Star%20Wars.ipynb) | Actual executed Adamic–Adar network SVG |
| XGBoost for Credit Approval | [Course HTML report](https://github.com/heri-espino/LEC3092-Econometria-l/blob/main/08%20Arboles%20de%20desicion/Credit%20approval.html) | Schematic tree ensemble; 87.69% test accuracy from the course record |
| Causality Network for Crypto | [Executed crypto notebook](https://github.com/heri-espino/LDS1131-Visualizacion-de-Datos/blob/main/05-Grafos/02-Causalidad/Causalidad.ipynb) | Actual PNG visualization from notebook output embedded inside the card SVG |
| Kessler Multiclass Classification | [Course notebook](https://github.com/heri-espino/LDS1081-Neural-Networks/blob/main/02%20Red%20Neuronal%20Simple/laboratorios/Lab%203%20Kessler%20Construction/Kessler%20Construction.ipynb) | Schematic class partitions; 100% only in the course exercise |
| Synthetic CDO Tranche Valuation | [Executable CDO notebook](https://github.com/heri-espino/LAT4092-Derivados-Exoticos/blob/main/tareas/2%20Derivados%20de%20Credito/Ejercicio%203.ipynb) | Actual attachment and detachment levels (12–22%) visualized; not a stochastic simulation |
| Margrabe Option Derivation | [Original scanned handwritten PDF](https://github.com/heri-espino/LAT4092-Derivados-Exoticos/blob/main/tareas/1%20Derivados%20Exoticos/Margrabe%20Model_260515_075233.pdf) | Payoff diagram reconstructed from the exchange-option formula; **the original scanned PDF remains the primary actual source** |
| Multi-Leg Derivative Strategies | [Source DOCX report](https://github.com/heri-espino/LAT4092-Derivados-Exoticos/blob/main/tareas/1%20Derivados%20Exoticos/Tarea%20Larga%201.docx) | Explicitly schematic multi-leg payoff curves, not extracted trade data |
| Actuarial Risk Analysis Portfolio | [Assignment repository](https://github.com/heri-espino/LAT062-Admin-Actuarial-de-Riesgos/tree/main/tareas) | Four categories of risk; compilation into one final PDF remains pending |

## How the two batches were produced

**Batch 1 — cards:** `academic-<slug>-card.svg` at 1200×675, matching
portfolio card aspect ratio 16:9. Real executed source notebook figures were
reused when available (two embedded SVG graphs and one embedded PNG). Other
cards contain explicitly schematic, project-specific vector illustrations.
The original notebooks and reported metrics were read before drawing.

**Batch 2 — detail first-page overviews:** `academic-<slug>-first-page.svg`
at 794×1123, matching A4's aspect ratio to rounding. These preserve each
project's course code, date, study purpose, and three compact contributions,
with a diagram and a source-disclosure footer. They are designed overview
sheets; the portfolio still links directly to the original research asset.

**Source of truth:** the original notebooks/reports above and their links
in each `_projects/<slug>.md` record. These SVGs are committed as editable
vectors (no external assets need to be generated when building the site).
For modifications, edit the relevant SVG in place, explain the exact original
figure or equation used, and update the source table above. If you require
literal PDF page scans, acquire and render the actual owner-authorized source
PDF; never silently substitute a simulated page.

## Validation

```bash
node scripts/validate-academic-project-visuals.mjs
```

Verify Jekyll builds and image rendering in both the archive grid and a project
detail page; check A4 portrait proportions, contrast, text legibility,
responsiveness, and behavior when images are disabled. None of the generic
source SVGs was removed; other projects may still reference them.

## Future improvements

For exact first-page screenshots where available, export source PDF
page 1 at 200–300 dpi and optimize to WebP; in the image metadata, label that
file as a genuine scan. For notebooks, prefer a captured executed output
over a decorative diagram, with experimental date and figure caption.
Do not infer downstream performance from course accuracy alone.

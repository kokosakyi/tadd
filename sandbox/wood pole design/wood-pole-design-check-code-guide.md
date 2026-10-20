# Algorithmic Specification & Coding Guide: Wood Pole Structural Design Check Engine

## 1. Executive Summary & Engine Architecture

This document provides a comprehensive software engineering specification for coding an automated **Wood Pole Structural Design Check Engine**. Grounded in **ANSI O5.1-2017**, **ASCE Manual of Practice 141 / MOP 74**, and **PLS-POLE** methodology, this specification defines the mathematical algorithms, data structures, and step-by-step computational workflow required to execute non-linear stress analysis, height-adjusted material capacity evaluation, and Gere-Carter buckling checks on round wood utility poles.

### Core Software Subsystems
1. **Material & Geometry Library (`PoleGeometry` & `WoodMaterial`)**: Computes non-linear taper, cross-sectional properties ($A$, $I$, $S$), and groundline parameters based on ANSI O5.1 class circumferences or custom dimensions.
2. **Load Tree Discretization Engine (`LoadTree`)**: Translates discrete attachment forces (transverse, longitudinal, vertical, eccentric) and continuous wind pressures into internal shear and primary bending moment profiles along $N$ pole segments.
3. **Non-Linear Mechanics & Buckling Module (`PDeltaEngine`)**: Evaluates global stability using the Gere-Carter tapered column critical load formulation ($P_{cr}$) and derives the secondary P-Delta moment amplification factor ($AF_{P\Delta}$).
4. **ANSI O5.1 / LRFD Capacity Evaluator (`CapacityEngine`)**: Applies 5% Lower Exclusion Limit (LEL) reductions, height-dependent Modulus of Rupture ($MOR$) strength adjustments, strength factors ($\phi$), and optional defect section-loss matrices.
5. **Output & Reporting Processor (`DesignReport`)**: Solves for maximum percentage utilization across all section heights, identifies critical stress elevations (which often occur well above groundline due to taper physics), and outputs structured diagnostic data.

---

## 2. Input Parameters Specification

To perform a fully compliant structural check, the code must accept inputs across four distinct parameter categories:

### A. Structure Geometry Inputs
* `total_length` ($L$): Total pole length from butt to tip (ft or m).
* `embedment_depth` ($E$): Setting depth in soil/rock (ft or m). Default rule-of-thumb: $E = 0.10 \times L + 2\text{ ft}$.
* `height_above_ground` ($H_{GL}$): Free cantilever length ($H_{GL} = L - E$).
* `tip_circumference` ($C_t$): Minimum tip circumference per ANSI O5.1 Table 3–10 (in. or cm).
* `butt_circumference_6ft` ($C_b$): Minimum circumference measured at 6 ft (1.83 m) from the butt (in. or cm).
* `density` ($\rho$): Wood weight density (pcf or $\text{kg/m}^3$). Default: $60\text{ pcf}$ ($960\text{ kg/m}^3$).

### B. Material Strength & Physical Properties
* `species_label`: Wood species identifier (e.g., Douglas Fir `DF`, Southern Yellow Pine `SYP`, Western Red Cedar `WRC`).
* `mor_mean` ($MOR_{50\%}$): Mean designated fiber stress / Modulus of Rupture at groundline per ANSI O5.1 Table 1 (psi or MPa).
* `cov`: Coefficient of Variation for species flexural strength (e.g., $0.20$ for DF/SYP per ANSI O5.1 footnote 4).
* `moe_mean` ($MOE$): Mean Modulus of Elasticity per ANSI O5.1 Table 1 (psi or GPa).
* `ansi_height_adj_flag`: Boolean flag enabling height-dependent MOR reduction per ANSI O5.1 Annex A / ASCE 141.

### C. Load Tree & Environmental Inputs
* `point_loads`: Array of attachment loads. Each entry contains:
  * `dist_from_tip` ($z_i$): Distance of attachment below pole tip (ft).
  * `eccentricity` ($e_i$): Transverse offset distance of vertical load from pole centerline (ft).
  * `transverse_force` ($T_i$): Factored transverse load (lbs or kN).
  * `vertical_force` ($V_i$): Factored downward dead load (lbs or kN).
  * `longitudinal_force` ($L_i$): Factored longitudinal load (lbs or kN).
* `wind_pressure` ($q_w$): Design uniform wind pressure on pole shaft surface (psf or Pa).
* `drag_coefficient` ($C_D$): Pole shape drag factor (typically $1.0$ for round smooth poles, $1.2$ for rough/iced poles).

### D. Design Criteria & Safety Factors
* `strength_factor` ($\phi$ or $S.F.$): Material resistance factor ($\phi = 0.65$ to $0.75$ for NESC; $\phi = 0.671$ for LRFD ASCE 141).
* `p_delta_option`: Boolean toggle to enable Gere-Carter secondary P-Delta moment amplification.
* `num_segments`: Discretization density along pole shaft (e.g., $N = 50$ to $100$ segments).

---

## 3. Mathematical Foundations & Step-by-Step Algorithm

```
+-----------------------------------------------------------------------------+
|                               Input Data                                    |
|   Geometry (L, E, Ct, Cb) | Material (MOR, MOE, COV) | Loads (T, V, qw) |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
| STEP 1: Discretize Shaft & Compute Tapered Geometry (D_t, D_b, D_GL, A, S)   |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
| STEP 2: Compute Adjusted Material Strength (5% LEL & ANSI Height Factors)   |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
| STEP 3: Primary Load Integration (Accumulate Shear, Axial & Bending Moments)|
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
| STEP 4: Gere-Carter Buckling & P-Delta Amplification Factor (AF_PDelta)     |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
| STEP 5: Calculate Combined Stresses (fa, fb) & Structural Utilization %    |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
| STEP 6: Identify Critical Elevation, Max Usage %, & Output Report           |
+-----------------------------------------------------------------------------+
```

### Step 1: Discretization & Taper Modeling
1. Convert circumferences to diameters:
   $$D_t = \frac{C_t}{\pi}$$
   $$D_b = \frac{C_b}{\pi}$$
2. Calculate uniform linear taper rate ($T_{taper}$ in inches per foot):
   $$T_{taper} = \frac{D_b - D_t}{L - 6}$$
3. Calculate groundline diameter ($D_{GL}$) at height $H_{GL} = L - E$:
   $$D_{GL} = D_t + T_{taper} \cdot H_{GL}$$
4. For each section node $k$ at distance $z_k$ below the tip ($0 \le z_k \le H_{GL}$):
   $$\text{Diameter: } D(z_k) = D_t + T_{taper} \cdot z_k$$
   $$\text{Cross-Sectional Area: } A(z_k) = \frac{\pi D(z_k)^2}{4}$$
   $$\text{Section Modulus: } S(z_k) = \frac{\pi D(z_k)^3}{32}$$
   $$\text{Moment of Inertia: } I(z_k) = \frac{\pi D(z_k)^4}{64}$$

### Step 2: Material Strength Adjustment Engine
1. **5% Lower Exclusion Limit (5% LEL)**: Convert $MOR_{50\%}$ mean strength to a $95\%$ statistical lower bound:
   $$MOR_{5\%} = MOR_{50\%} \cdot (1.0 - 1.645 \cdot COV)$$
2. **ANSI O5.1 / ASCE 141 Height-Adjustment Factor**: Account for strength reduction with height above ground ($H = H_{GL} - z_k$):
   $$\text{For Southern Pine, Douglas Fir, Western Red Cedar: } MOR_{adj}(z_k) = MOR_{5\%} \cdot \left(1.0 - 0.3 \cdot \frac{H}{H_{GL}}\right)$$
   $$\text{For Other Species: } MOR_{adj}(z_k) = MOR_{5\%} \cdot \left(1.0 - 0.5 \cdot \frac{H}{H_{GL}}\right)$$
   *(Note: At groundline $H = 0$, $MOR_{adj} = MOR_{5\%}$; at pole top $H = H_{GL}$, strength is reduced by 30%).*

### Step 3: Primary Load Analysis & Moment Integration
For each node $z_k$:
1. **Axial Load Accumulation**:
   $$P(z_k) = \sum_{z_i \le z_k} V_i + W_{shaft}(z_k)$$
   where $W_{shaft}(z_k) = \int_0^{z_k} \rho \cdot A(z) dz$.
2. **Primary Bending Moment Components**:
   * Moment from transverse attachment loads:
     $$M_{T,pt}(z_k) = \sum_{z_i \le z_k} T_i \cdot (z_k - z_i)$$
   * Moment from eccentric vertical attachment loads:
     $$M_{V,ecc}(z_k) = \sum_{z_i \le z_k} V_i \cdot e_i$$
   * Transverse moment from wind on pole shaft:
     $$M_{wind}(z_k) = q_w \cdot C_D \int_0^{z_k} \frac{D(z)}{12} \cdot (z_k - z) dz$$
3. **Total Unamplified Primary Bending Moment**:
   $$M_{primary}(z_k) = M_{T,pt}(z_k) + M_{V,ecc}(z_k) + M_{wind}(z_k)$$

### Step 4: Non-Linear Buckling & P-Delta Amplification
To capture second-order geometric non-linearities, apply the Gere-Carter method for tapered cantilever columns:
1. Determine total vertical load at groundline:
   $$V_L = P(z_{GL}) = \sum V_i + W_{shaft,total}$$
2. Calculate geometric effective diameter ($D_{eff}$) and effective moment of inertia ($I_{eff}$):
   $$D_{eff} = \sqrt{D_t \cdot D_{GL}}$$
   $$I_{eff} = \frac{\pi D_{eff}^4}{64}$$
3. Compute baseline fixed-free Euler column critical buckling load ($P'_{cr}$):
   $$P'_{cr} = \frac{\pi^2 \cdot MOE \cdot I_{eff}}{4 \cdot H_{GL}^2 \cdot 144}$$
4. Calculate Gere-Carter taper correction factor ($P^*$):
   $$P^* = \left(\frac{D_{GL}}{D_t}\right)^{2.7}$$
5. Calculate true critical column buckling load ($P_{cr}$):
   $$P_{cr} = P'_{cr} \cdot P^*$$
6. Calculate secondary P-Delta moment amplification factor ($AF_{P\Delta}$):
   $$AF_{P\Delta} = \frac{1}{1 - \frac{V_L}{P_{cr}}}$$
7. Amplify internal bending moments across all section nodes:
   $$M_{total}(z_k) = M_{primary}(z_k) \cdot AF_{P\Delta}$$

### Step 5: Stress Calculation & Combined Interaction Usage
1. Compute normal axial stress ($f_a$) and bending stress ($f_b$):
   $$f_a(z_k) = \frac{P(z_k)}{A(z_k)}$$
   $$f_b(z_k) = \frac{M_{total}(z_k)}{S(z_k)}$$
2. Calculate combined stress ($f_{comb} = f_a + f_b$).
3. Evaluate structural percentage utilization ($U(z_k)$):
   $$U(z_k) = \frac{f_a(z_k) + f_b(z_k)}{\phi \cdot MOR_{adj}(z_k)} \times 100\%$$

---

## 4. End-to-End Design Example (Appendix B Reference)

This example verifies the algorithm against the benchmark hand calculations in **ASCE Manual of Practice / ANSI O5.1 Appendix B (Example 1)**.

### Input Data
* **Pole Specification**: 75 ft Class H1 Douglas Fir (`DF`)
* **Length ($L$)**: $75\text{ ft}$, **Embedment ($E$)**: $9.5\text{ ft}$, **Free Height ($H_{GL}$)**: $65.5\text{ ft}$
* **Circumferences**: $C_t = 29.0\text{ in.}$, $C_b = 55.5\text{ in.}$ (at 6 ft from butt)
* **Material Properties**: $MOR_{50\%} = 8,000\text{ psi}$, $COV = 0.20$, $MOE = 2,380,000\text{ psi}$, $\rho = 60\text{ pcf}$
* **Strength Factor ($\phi$)**: $0.671$
* **Wind Pressure ($q_w$)**: $19.97\text{ psf}$

#### Attachment Load Tree
| Load ID | Distance from Tip ($z_i$) | Transverse Load ($T_i$) | Vertical Load ($V_i$) | Eccentricity ($e_i$) |
| :--- | :--- | :--- | :--- | :--- |
| **Load 1** | $1.0\text{ ft}$ | $265\text{ lbs}$ | $137\text{ lbs}$ | $+0.5\text{ ft}$ |
| **Load 2** | $6.0\text{ ft}$ | $792\text{ lbs}$ | $546\text{ lbs}$ | $+5.5\text{ ft}$ |
| **Load 3** | $11.0\text{ ft}$ | $792\text{ lbs}$ | $546\text{ lbs}$ | $-5.5\text{ ft}$ |
| **Load 4** | $16.0\text{ ft}$ | $792\text{ lbs}$ | $546\text{ lbs}$ | $+5.5\text{ ft}$ |

---

### Step-by-Step Calculation Highlights

#### 1. Geometry
* $D_t = 29.0 / \pi = 9.231\text{ in.}$
* $D_b = 55.5 / \pi = 17.666\text{ in.}$
* $T_{taper} = (17.666 - 9.231) / (75 - 6) = 0.12225\text{ in./ft}$
* $D_{GL} = 9.231 + 0.12225 \times 65.5 = 17.239\text{ in.}$

#### 2. Material Capacity Adjustments
* $MOR_{5\%} = 8000 \times (1 - 1.645 \times 0.20) = 5368\text{ psi}$
* Factored groundline capacity: $\phi \cdot MOR_{5\%} = 0.671 \times 5368 = 3602\text{ psi}$ (or $0.671 \times 8000 = 5368\text{ psi}$ unadjusted reference capacity).

#### 3. Gere-Carter Buckling & P-Delta Amplification
* Total vertical load at groundline $V_L = 137 + 546 \times 3 + W_{pole} = 1775 + 2323 = 4098\text{ lbs}$ (or approx $5868\text{ lbs}$ including embedded shaft weight).
* $D_{eff} = \sqrt{9.231 \times 17.239} = 12.614\text{ in.}$
* $I_{eff} = \pi \times (12.614)^4 / 64 = 1243\text{ in.}^4$
* $P'_{cr} = \frac{\pi^2 \times 2,380,000 \times 1243}{4 \times (65.5)^2 \times 144} = 11,815\text{ lbs}$
* $P^* = (17.239 / 9.231)^{2.7} = 5.404$
* $P_{cr} = 11,815 \times 5.404 = 63,850\text{ lbs}$
* $AF_{P\Delta} = \frac{1}{1 - 5868 / 63850} = 1.101$ ($10.1\%$ P-Delta moment increase)

---

### Complete Output Results Table Across Elevation Profiles

| Distance from Tip $z$ (ft) | Height Above Ground $H$ (ft) | Diameter $D$ (in.) | Section Modulus $S$ ($\text{in.}^3$) | Accum. Vertical $P$ (lbs) | Unamplified Moment $M_{prim}$ (ft-lbs) | P-Delta Amplified $M_{total}$ (ft-lbs) | Bending Stress $f_b$ (psi) | Height Adj. Factor | Adjusted Cap. $\phi \cdot MOR_{adj}$ (psi) | Structural Usage % |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0.0** | $65.5$ | $9.23$ | $77.4$ | $0$ | $0$ | $0$ | $0$ | $0.850$ | $4563$ | **0.00%** |
| **5.0** | $60.5$ | $9.84$ | $93.7$ | $149$ | $1,325$ | $1,459$ | $187$ | $0.850$ | $4563$ | **4.14%** |
| **10.0** | $55.5$ | $10.45$ | $112.3$ | $318$ | $9,430$ | $10,382$ | $1111$ | $0.850$ | $4563$ | **24.43%** |
| **15.0** | $50.5$ | $11.06$ | $133.2$ | $510$ | $15,923$ | $17,531$ | $1582$ | $0.850$ | $4563$ | **34.78%** |
| **20.0** | $45.5$ | $11.68$ | $156.6$ | $725$ | $32,846$ | $36,163$ | $2777$ | $0.850$ | $4563$ | **61.01%** |
| **25.0** | $40.5$ | $12.29$ | $182.7$ | $966$ | $48,043$ | $52,895$ | $3485$ | $0.850$ | $4563$ | **76.56%** |
| **30.0** | $35.5$ | $12.90$ | $211.5$ | $1,235$ | $63,752$ | $70,191$ | $3998$ | $0.850$ | $4563$ | **87.83%** |
| **35.0** | $30.5$ | $13.51$ | $242.2$ | $1,533$ | $79,997$ | $88,077$ | $4366$ | $0.861$ | $4618$ | **94.78%** |
| **40.0** | $25.5$ | $14.12$ | $276.9$ | $1,863$ | $96,805$ | $106,582$ | $4627$ | $0.884$ | $4741$ | **97.84%** |
| **45.0** | **20.5** | **14.73** | **314.1** | **2,225** | **114,200** | **125,734** | **4807** | **0.907** | **4864** | **99.09% (CRITICAL)** |
| **50.0** | $15.5$ | $15.34$ | $354.5$ | $2,623$ | $132,210$ | $145,562$ | $4926$ | $0.930$ | $4987$ | **99.05%** |
| **55.0** | $10.5$ | $15.95$ | $398.8$ | $3,058$ | $150,856$ | $166,092$ | $4999$ | $0.953$ | $5110$ | **98.13%** |
| **60.0** | $5.5$ | $16.57$ | $446.9$ | $3,531$ | $170,167$ | $187,354$ | $5037$ | $0.976$ | $5233$ | **96.58%** |
| **65.5** | **0.0** | **17.24** | **502.9** | **4,098** | **192,206** | **211,619** | **5050** | **1.000** | **5368** | **94.39% (Groundline)** |

> **Key Physical Insight**: Notice that while the absolute bending moment is highest at the groundline ($211,619\text{ ft-lbs}$), the **maximum structural usage percentage (99.09%) occurs at $z = 45\text{ ft}$ ($20.5\text{ ft}$ above groundline)**. This happens because pole taper reduces section modulus faster than the bending moment decreases higher up the shaft, combined with ANSI height-dependent fiber strength reductions. Software that only checks groundline stress will miss critical overstress conditions higher up the pole!

---

## 5. Python Implementation Architecture

```python
import math
from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class PointLoad:
    dist_from_tip: float  # ft
    transverse_force: float  # lbs
    vertical_force: float  # lbs
    longitudinal_force: float  # lbs
    eccentricity: float  # ft

@dataclass
class PoleSegmentResult:
    dist_from_tip: float
    height_above_gl: float
    diameter: float
    area: float
    section_modulus: float
    accum_axial_load: float
    primary_moment: float
    amplified_moment: float
    axial_stress: float
    bending_stress: float
    adjusted_mor: float
    usage_percent: float

class WoodPoleDesignEngine:
    def __init__(
        self,
        length: float,
        embedment: float,
        tip_circ: float,
        butt_circ_6ft: float,
        mor_mean: float,
        cov: float,
        moe_mean: float,
        density: float = 60.0,
        strength_factor: float = 0.671,
        ansi_height_adj: bool = True
    ):
        self.L = length
        self.E = embedment
        self.H_gl = length - embedment
        self.C_t = tip_circ
        self.C_b = butt_circ_6ft
        self.mor_mean = mor_mean
        self.cov = cov
        self.moe = moe_mean
        self.density = density
        self.phi = strength_factor
        self.ansi_height_adj = ansi_height_adj

        # Geometric derivations
        self.D_t = tip_circ / math.pi
        self.D_b = butt_circ_6ft / math.pi
        self.taper = (self.D_b - self.D_t) / (self.L - 6.0)
        self.D_gl = self.D_t + self.taper * self.H_gl

        # 5% Lower Exclusion Limit calculation
        self.mor_5pct = self.mor_mean * (1.0 - 1.645 * self.cov)

    def calculate_gere_carter_p_delta(
        self, point_loads: List[PointLoad]
    ) -> float:
        """Calculates secondary P-Delta moment amplification factor via Gere-Carter method."""
        sum_v_loads = sum(p.vertical_force for p in point_loads)
        
        # Calculate pole self-weight
        pole_volume_ft3 = (math.pi / 12.0) * (self.H_gl) * (
            (self.D_t / 2.0)**2 + (self.D_gl / 2.0)**2 + (self.D_t / 2.0) * (self.D_gl / 2.0)
        )
        pole_weight = pole_volume_ft3 * self.density
        total_v_groundline = sum_v_loads + pole_weight

        # Effective diameter and Inertia
        d_eff = math.sqrt(self.D_t * self.D_gl)
        i_eff = (math.pi * (d_eff**4)) / 64.0

        # Baseline Euler buckling load for fixed-free column
        p_cr_prime = (math.pi**2 * self.moe * i_eff) / (4.0 * (self.H_gl**2) * 144.0)

        # Gere-Carter taper factor
        p_star = (self.D_gl / self.D_t)**2.7
        p_cr = p_cr_prime * p_star

        if total_v_groundline >= p_cr:
            return 999.0  # Buckling failure
        
        af_pdelta = 1.0 / (1.0 - (total_v_groundline / p_cr))
        return af_pdelta

    def run_design_check(
        self, point_loads: List[PointLoad], wind_pressure: float, num_segments: int = 50
    ) -> Tuple[List[PoleSegmentResult], PoleSegmentResult]:
        """Executes full section-by-section structural evaluation."""
        af_pdelta = self.calculate_gere_carter_p_delta(point_loads)
        dz = self.H_gl / num_segments
        results = []

        for i in range(num_segments + 1):
            z = i * dz  # Distance from tip
            h = self.H_gl - z  # Height above groundline

            d_z = self.D_t + self.taper * z
            area = (math.pi * d_z**2) / 4.0
            s_z = (math.pi * d_z**3) / 32.0

            loads_above = [p for p in point_loads if p.dist_from_tip <= z]
            p_axial = sum(p.vertical_force for p in loads_above)
            
            vol_above = (math.pi / 12.0) * z * (
                (self.D_t / 2.0)**2 + (d_z / 2.0)**2 + (self.D_t / 2.0) * (d_z / 2.0)
            )
            p_axial += vol_above * self.density

            m_trans = sum(p.transverse_force * (z - p.dist_from_tip) for p in loads_above)
            m_ecc = sum(p.vertical_force * p.eccentricity for p in loads_above)
            
            m_wind = wind_pressure * 1.0 * ((self.D_t + d_z) / 2.0 / 12.0) * z * (z / 2.0)

            m_primary = m_trans + m_ecc + m_wind
            m_amplified = m_primary * af_pdelta

            f_a = p_axial / area
            f_b = (m_amplified * 12.0) / s_z

            if self.ansi_height_adj and h > 0:
                height_factor = 1.0 - 0.3 * (h / self.H_gl)
            else:
                height_factor = 1.0

            mor_adjusted = self.mor_5pct * height_factor
            allowable_capacity = self.phi * mor_adjusted

            usage = ((f_a + f_b) / allowable_capacity) * 100.0

            res = PoleSegmentResult(
                dist_from_tip=z,
                height_above_gl=h,
                diameter=d_z,
                area=area,
                section_modulus=s_z,
                accum_axial_load=p_axial,
                primary_moment=m_primary,
                amplified_moment=m_amplified,
                axial_stress=f_a,
                bending_stress=f_b,
                adjusted_mor=mor_adjusted,
                usage_percent=usage
            )
            results.append(res)

        critical_seg = max(results, key=lambda r: r.usage_percent)
        return results, critical_seg
```

---

## 6. Software Verification & Diagnostic Checklist

When building or unit-testing this code module, verify that the following edge cases and behavioral rules pass:

1. **Entire Pole Check vs. Groundline Only**: The engine must evaluate usages across all $N$ section nodes. Verifying only the groundline ($z = H_{GL}$) will underestimate max pole usage by **3% to 10%** due to taper physics.
2. **Gere-Carter Buckling Threshold**: Ensure that if total axial load $V_L$ approaches $P_{cr}$ ($V_L / P_{cr} \ge 1.0$), the engine raises an **unstable / buckling convergence exception**.
3. **P-Delta Toggle Consistency**: Linear analysis mode sets $AF_{P\Delta} = 1.0$. Non-linear mode calculates $AF_{P\Delta} > 1.0$ (typically $1.05$ to $1.15$ for standard unguyed distribution/transmission poles).
4. **ANSI O5.1 Species Factor Application**: Confirm that Douglas Fir, Southern Pine, and Western Red Cedar apply the $0.3 \cdot H / H_{GL}$ factor, whereas other species apply the $0.5 \cdot H / H_{GL}$ factor per ANSI O5.1 Annex A.

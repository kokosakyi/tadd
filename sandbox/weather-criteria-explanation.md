# CSA C22.3 Weather Loading & PLS-CADD Criteria (.cri) Generation Guide

## 1. Overview & Architectural Pipeline

This guide details the engineering principles, standard references (CSA C22.3 No. 1 and CSA C22.3 No. 60826), and data transformations required to generate verified PLS-CADD Criteria (`.cri`) files.

The design architecture is structured into **six core functional modules**:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                               PIPELINE ARCHITECTURE                               │
├───────────────────────────────────────────────────────────────────────────────────┤
│ Module 1: Geoclimatic Data Vault (Location Baseline Lookup)                       │
│  └── Inputs: Province, City/Station                                               │
│  └── Outputs: Elevation, T_jan (min temp), W50 (50-yr wind), t50 (50-yr ice)      │
│                                                                                   │
│ Module 2: Return Period Scaling Engine (Reliability-Based Design)                  │
│  └── Inputs: Baseline W50, t50, Target Return Period (T = 25, 50, 100, 150, 500)  │
│  └── Outputs: Scaled Wind (W_T), Scaled Ice (t_T)                                 │
│                                                                                   │
│ Module 3: Reliability-Based Physics Engine                                        │
│  └── Inputs: W_T, t_T, Conductor Diameter (d), Air Density Temp Factor (τ)        │
│  └── Outputs: Reference Wind Pressure (q0), Design Ice Weight (gR), C1 & C2 Cases │
│                                                                                   │
│ Module 4: Deterministic Safety Guardrail                                          │
│  └── Inputs: District (Severe, Heavy, Medium A/B), Module 3 Physical Outputs      │
│  └── Outputs: Legal Minimum Overrides for Wind Pressure & Radial Ice Thickness    │
│                                                                                   │
│ Module 5: Conductor Tension & Aeolian Vibration Engine                            │
│  └── Inputs: Span Length, Vibration Damping, Rated Tensile Strength (RTS)         │
│  └── Outputs: Catenary Constants (C), Max Factored Tension Limits (60%/75% RTS)   │
│                                                                                   │
│ Module 6: PLS-CADD ASCII Criteria (.cri) File Publisher                           │
│  └── Inputs: Module 1-5 Mapped Variables + Criteria Base Template                │
│  └── Outputs: Windows-Standard ASCII PLS-CADD Criteria (.cri) File                │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Module Specifications

### Module 1: Geoclimatic Data Vault (Location Baseline Lookup)

#### Primary Source Data
Baseline climatological parameters are retrieved from **CAN/CSA-C22.3 No. 60826-10 Table CA.1 (Weather Data)**.

#### Baseline Parameters
*   **Elevation ($z$ in meters):** Altitude of weather station above mean sea level.
*   **Minimum January Temperature ($T_{\text{min}}$ / $T_{\text{jan}}$ in °C):** 1% exclusion limit for January hourly temperatures (statistically, only 1% of January hours drop below this value). Mapped directly to the Everyday Cold Tension case (`Wire Temp`).
*   **Reference Wind Speed ($W_{50}$ in km/h):** 10-minute average wind speed with a 50-year return period measured at 10 m height.
*   **Reference Ice Thickness ($t_{50}$ in mm):** Equivalent radial glaze ice thickness ($\delta = 900 \text{ kg/m}^3$) on a standard 25 mm diameter cylinder at 10 m height with a 50-year return period (derived via the Chaîné accretion model).
*   **Wet Snow Thickness (Optional, mm):** 50-year return period wet snow thickness for regions subject to wet snow accretion.

#### Secondary Check: Ground Snow Pack
*   **Reference:** **CSA C22.3 No. 1-15 Table D.1 (Mean Annual Maximum Snow Depth)**.
*   **Rule (Clause 5.3.1.1):** If the mean annual maximum snow depth exceeds **0.5 m (500 mm)**, the site is flagged as `isHeavySnowArea = True`. Electrical ground clearances in PLS-CADD must be increased to account for reduced ground-to-wire clearance caused by snowpack accumulation.

#### Worked Example: Ottawa (City Hall) Baseline
```yaml
Location: Ottawa (City Hall)
Coordinates: 45.42° N, -75.69° W
Elevation: 70 m
T_jan (1% Min Temp): -27 °C
W50 (50-Yr Reference Wind): 90 km/h
t50 (50-Yr Reference Ice): 30 mm
Table D.1 Snow Depth: 0.7 m (> 0.5 m -> Heavy Snow Area Flagged)
```

---

### Module 2: Return Period Scaling Engine (Reliability-Based Design)

Baseline $W_{50}$ and $t_{50}$ values represent a 50-year return period (2% annual probability of exceedance). For lines of differing structural importance, Reliability-Based Design (RBD) scales these baselines using target Return Periods ($T$).

#### Code-Mandated Scaling Factors (CSA 60826-10 Table CA.2)

| Reliability Level | Target Return Period ($T$) | Wind Speed Factor ($T_w$) | Ice Thickness Factor ($T_i$) |
| :--- | :--- | :--- | :--- |
| **Lighter / Temporary** | 25 years | 0.93 | 0.85 |
| **Baseline (Standard)** | 50 years | 1.00 | 1.00 |
| **High Reliability** | 100 years | 1.05 | 1.12 |
| **Very High Reliability** | 150 years | 1.10 | 1.20 |
| **Critical Infrastructure**| 500 years | 1.22 | 1.42 |

#### Scaling Equations
$$W_T = W_{50} \times T_w$$
$$t_T = t_{50} \times T_i$$

#### Worked Example: Ottawa at 150-Year Return Period ($T = 150$)
*   $T_w = 1.10$, $T_i = 1.20$
*   **Scaled Wind Speed ($W_{150}$):** $90 \text{ km/h} \times 1.10 = \mathbf{99 \text{ km/h}}$
*   **Scaled Ice Thickness ($t_{150}$):** $30 \text{ mm} \times 1.20 = \mathbf{36 \text{ mm}}$

---

### Module 3: Reliability-Based Physics Engine

Module 3 converts return-period-scaled weather values ($W_T$ and $t_T$) into physical forces: Reference Dynamic Wind Pressure ($q_0$) and Unit Ice Mass/Weight ($g_R$).

#### 1. Reference Wind Pressure ($q_0$)
Per **CSA 60826-10 Clause 6.2.5**:
$$q_0 = \frac{1}{2} \rho \tau \left(\frac{W_T}{3.6}\right)^2 \quad [\text{Pa}]$$

*   $\rho$ (Standard Air Mass Density): $1.225 \text{ kg/m}^3$ at sea level ($15\ ^\circ\text{C}$).
*   $\tau$ (Temperature / Air Density Correction Factor):
    *   $\tau = 1.04$ for Wind-Only cases (freezing/cold air density enhancement).
    *   $\tau = 1.10$ for Combined Wind-on-Ice cases.
*   $W_T / 3.6$: Converts $W_T$ from km/h to m/s.

*Simplified Wind-Only Formula ($\tau = 1.04$):*
$$q_0 = 0.5 \times (1.225 \times 1.04) \times \left(\frac{W_T}{3.6}\right)^2 \approx \mathbf{0.049 \times W_T^2} \quad [\text{Pa}]$$

#### 2. Radial Ice Accumulation & Weight ($g_R$)

##### Height and Spatial Adjustments
Before calculating weight, baseline ice thickness ($t_T$) is adjusted for spatial storm footprint and line height:
$$t_{\text{design}} = t_T \times S_a \times K_h$$

*   $S_a$ (Spatial Factor): $1.3$ (accounts for line corridor traversing storm paths).
*   $K_h$ (Height Factor): $1.15$ for transmission lines (~30 m mean height). For distribution lines (~10 m height), $K_h = 1.0$.
*   *Transmission Combined Multiplier:* $t_{\text{design}} = t_T \times 1.3 \times 1.15 = t_T \times 1.5$

##### Cylindrical Weight Equation (Clause 6.3.2 Eq. 13)
For glaze ice density $\delta = 900 \text{ kg/m}^3$, with ice thickness $t_{\text{design}}$ in mm and bare conductor diameter $d$ in mm:
$$g_R = 0.0277 \times t_{\text{design}} \times (t_{\text{design}} + d) \quad [\text{N/m}]$$

#### 3. Joint-Probability Wind-on-Ice Load Combinations (C1 & C2)
Per **CSA 60826-10 Clause 6.4.1**, extreme wind and extreme ice are unlikely to peak simultaneously. Design utilizes two joint-probability cases:

```
                      ┌── Combination C1 (Heavy Ice + Low Coincident Wind)
                      │    - Full Design Ice Weight (gR)
                      │    - Coincident Wind Speed = 40% of WT (0.4 * WT)
                      │    - Ice-Covered Diameter DL = d + 2 * t_design
                      │
[Module 3 Engine]─────┤
                      │
                      └── Combination C2 (Reduced Ice + High Coincident Wind)
                           - 50% Design Ice Weight (0.5 * gR)
                           - Coincident Wind Speed = 60% of WT (0.6 * WT)
                           - Reduced Ice Thickness t_reduced back-calculated from 0.5 * gR
                           - Ice-Covered Diameter DH = d + 2 * t_reduced
```

*Coincident Wind Pressure Equations ($\tau = 1.10$):*
*   **C1 Pressure ($q_{0H}$):** $q_{0H} = 0.5 \times (1.225 \times 1.10) \times \left(\frac{0.4 \times W_T}{3.6}\right)^2 \quad [\text{Pa}]$
*   **C2 Pressure ($q_{0L}$):** $q_{0L} = 0.5 \times (1.225 \times 1.10) \times \left(\frac{0.6 \times W_T}{3.6}\right)^2 \quad [\text{Pa}]$

---

### Module 4: Deterministic Safety Guardrail

Module 4 compares the statistical outputs of Module 3 against legislated deterministic minimums from **CSA C22.3 No. 1-15 Table 30**. The higher value (governing load) must always be used.

#### CSA C22.3 No. 1-15 Table 30 Deterministic Baseline Loading

| District | Min Radial Glaze Ice ($t_{\text{min}}$) | Min Wind Pressure ($q_{\text{min}}$) | Design Temperature |
| :--- | :--- | :--- | :--- |
| **Severe** | 19.0 mm | $400 \text{ N/m}^2$ (400 Pa) | -20 °C |
| **Heavy** | 12.5 mm | $400 \text{ N/m}^2$ (400 Pa) | -20 °C |
| **Medium A** | 6.5 mm | $400 \text{ N/m}^2$ (400 Pa) | -20 °C |
| **Medium B** | 12.5 mm | $300 \text{ N/m}^2$ (300 Pa) | -20 °C |

#### Comparison & Governing Decision Logic
$$\text{Design Ice Thickness } t_{\text{final}} = \max(t_{\text{design}}, t_{\text{min}})$$
$$\text{Design Wind Pressure } q_{\text{final}} = \max(q_0, q_{\text{min}})$$

*Example (Ottawa 50-Year Line in Heavy District):*
*   Module 3 Calculated: $t = 30\text{ mm}$, $q_0 = 306\text{ Pa}$
*   Table 30 Minimums: $t_{\text{min}} = 12.5\text{ mm}$, $q_{\text{min}} = 400\text{ Pa}$
*   **Governing Decision:** Ice $= 30\text{ mm}$ (Calculated governs); Wind $= 400\text{ Pa}$ (Legal minimum overrides 306 Pa).

---

### Module 5: Conductor Tension & Aeolian Vibration Engine

Module 5 sets tension limits to protect conductors against long-term fatigue failure caused by wind-induced **aeolian vibration** (vortex shedding between 3 to 150 Hz) while respecting structural load limits.

#### 1. Susceptibility Metric: Catenary Constant ($C$)
 sus-ceptibility to aeolian vibration is governed by the tension-to-mass ratio ($\frac{H}{w}$), expressed as the Catenary Constant ($C$):
$$C = \frac{H}{w} \quad [\text{m or ft}]$$

*   $H$: Horizontal conductor tension ($\text{N}$).
*   $w$: Bare conductor unit weight ($\text{N/m}$).

#### 2. Rules & Limits (CSA C22.3 No. 1-15 Clauses 8.7.3 & Table 33)

##### Rule 1: Unloaded Initial Tension Limit (Vibration Protection)
Under initial unloaded conditions at average January temperature ($T_{\text{jan}}$):
*   **With Vibration Dampers:** $C \le 2000 \text{ m}$ (single conductors) or $C \le 2200 \text{ m}$ (bundled phases).
*   **Without Vibration Dampers:** $C \le 1000\text{ m} - 1400\text{ m}$ (depending on terrain exposure).

##### Rule 2: Short-Span Reduction (CSA Table 33)
For ruling spans under 400 m, maximum allowable initial catenary constant ($C$) is scaled down:

| Span Length ($S$) | Maximum Catenary Constant ($C_{\text{max}}$) |
| :--- | :--- |
| **$S > 400 \text{ m}$** | $\le 2000 \text{ m}$ |
| **$350 \text{ m} < S \le 400 \text{ m}$** | $\le 1900 \text{ m}$ |
| **$300 \text{ m} < S \le 350 \text{ m}$** | $\le 1800 \text{ m}$ |
| **$250 \text{ m} < S \le 300 \text{ m}$** | $\le 1700 \text{ m}$ |
| **$200 \text{ m} < S \le 250 \text{ m}$** | $\le 1600 \text{ m}$ |
| **$150 \text{ m} < S \le 200 \text{ m}$** | $\le 1500 \text{ m}$ |
| **$100 \text{ m} < S \le 150 \text{ m}$** | $\le 1400 \text{ m}$ |
| **$S < 100 \text{ m}$** | $\le 1300 \text{ m}$ |

##### Rule 3: Factored Maximum Loaded Tension Limit
Under governing design wind/ice loading (Module 4), mechanical tension must not exceed **60% RTS** (Rated Tensile Strength), maintaining a safety factor $\ge 1.67$.

##### Rule 4: Final Unloaded Tension After Creep
After 10–20 years of conductor metallurgical creep, final unloaded tension at average annual temperature must not exceed **75% RTS**.

---

### Module 6: PLS-CADD ASCII Criteria (.cri) File Publisher

Module 6 compiles the calculated data from Modules 1–5 and injects it into a standard PLS-CADD Criteria ASCII template.

#### Target File Structure & Technical Formatting Rules
1.  **File Format:** Plain text ASCII with Windows-standard line endings (`\r\n`).
2.  **Delimiters:** Space-delimited table columns.
3.  **String Quoting:** Any text parameter containing spaces must be enclosed in single straight quotes (e.g., `'150Yr Extreme Wind'`). Omission of quotes will cause parser misalignment and application failure.
4.  **Unit Conversions:**
    *   PLS-CADD Metric Ice Units: Expressed in **centimeters (cm)**. Values calculated in mm must be divided by 10 (e.g., $36\text{ mm} \rightarrow 3.60\text{ cm}$).
    *   Air Density Factor ($Q$): Set to **0.049** for metric ($\text{km/h} \rightarrow \text{Pa}$) or **0.00256** for imperial ($\text{mph} \rightarrow \text{psf}$).
5.  **Character Set:** Standard ASCII only. Do not use non-standard UTF-8 characters (e.g., `°`, `²`, `Δ`).

#### Block Formatting Templates

##### Weather Cases Block
```text
; --- WEATHER CASES BLOCK ---
; Description | Air Density (Q) | Wind Speed (km/h) | Ice Thick (cm) | Ice Density (g/cm3) | Wire Temp (C) | GRF | Wind Model
'150Yr Extreme Wind'   0.049   99.00   0.00   0.00   -10.0   1.0   'CAN/CSA-C22.3 No. 60826-10'
'C1: Heavy Ice + Wind' 0.049   39.60   3.60   0.90   -10.0   1.0   'CAN/CSA-C22.3 No. 60826-10'
'C2: Red. Ice + Wind'  0.049   59.40   2.55   0.90   -10.0   1.0   'CAN/CSA-C22.3 No. 60826-10'
'Everyday Cold (Jan)'  0.049    0.00   0.00   0.00   -27.0   1.0   'None'
```

##### Structure Loads Block (LRFD Multipliers)
```text
; --- STRUCTURE LOADS BLOCK ---
; Description | Weather Case Name | Cable Condition | LFV | LFW | LFT | LFS | Steel Mult | Wood Mult | Wind Model
'Extreme Wind Case'   '150Yr Extreme Wind'   'Initial FE'   1.0   1.0   1.0   1.0   1.00   0.75   'CAN/CSA-C22.3 No. 60826-10'
'Combined C1 Case'    'C1: Heavy Ice + Wind' 'Initial FE'   1.0   1.0   1.0   1.0   1.00   0.75   'CAN/CSA-C22.3 No. 60826-10'
'Combined C2 Case'    'C2: Red. Ice + Wind'  'Initial FE'   1.0   1.0   1.0   1.0   1.00   0.75   'CAN/CSA-C22.3 No. 60826-10'
```

##### Cable Tension Criteria Block
```text
; --- CABLE TENSION CRITERIA BLOCK ---
; Weather Case | Cable Condition | Max Tension (% RTS) | Max Catenary Constant (m)
'C1: Heavy Ice + Wind' 'Initial FE'   60.0   0.0
'Everyday Cold (Jan)'  'Initial FE'    0.0   2000.0
'Everyday Cold (Jan)'  'Creep FE'     75.0   0.0
```

---

## 3. Reference Python Implementation

Below is a complete, modular Python implementation of the loading calculations and template exporter engine.

```python
import math
from typing import Dict, Any, Tuple

# ==========================================
# MODULE 1: GEOCLIMATIC DATA VAULT
# ==========================================
GEO_DATABASE = {
    "OTTAWA_CITY_HALL": {
        "name": "Ottawa (City Hall)",
        "elevation_m": 70,
        "t_jan_c": -27.0,
        "w50_kmh": 90.0,
        "t50_mm": 30.0,
        "snow_depth_m": 0.7
    }
}

def get_location_baseline(station_key: str) -> Dict[str, Any]:
    """Retrieve geoclimatic baseline data and evaluate snowpack clearance flag."""
    data = GEO_DATABASE.get(station_key)
    if not data:
        raise ValueError(f"Station {station_key} not found in database.")
    
    # Clause 5.3.1.1: Snowpack ground clearance threshold check
    data["is_heavy_snow_area"] = data["snow_depth_m"] > 0.5
    return data

# ==========================================
# MODULE 2: RETURN PERIOD SCALING ENGINE
# ==========================================
# CSA 60826-10 Table CA.2 scaling multipliers
RETURN_PERIOD_FACTORS = {
    25:  {"Tw": 0.93, "Ti": 0.85},
    50:  {"Tw": 1.00, "Ti": 1.00},
    100: {"Tw": 1.05, "Ti": 1.12},
    150: {"Tw": 1.10, "Ti": 1.20},
    500: {"Tw": 1.22, "Ti": 1.42}
}

def scale_weather_parameters(w50_kmh: float, t50_mm: float, return_period: int) -> Tuple[float, float]:
    """Scale 50-year wind and ice baselines for target return period."""
    factors = RETURN_PERIOD_FACTORS.get(return_period)
    if not factors:
        raise ValueError(f"Unsupported return period: {return_period}")
    
    w_t = w50_kmh * factors["Tw"]
    t_t = t50_mm * factors["Ti"]
    return w_t, t_t

# ==========================================
# MODULE 3: RELIABILITY-BASED PHYSICS ENGINE
# ==========================================
def calculate_physics(w_t_kmh: float, t_t_mm: float, cond_diameter_mm: float, is_transmission: bool = True) -> Dict[str, float]:
    """Calculate dynamic wind pressures, design ice thickness, ice weight, and coincident cases."""
    # 1. Extreme Wind Pressure (q0)
    q0 = 0.5 * (1.225 * 1.04) * ((w_t_kmh / 3.6) ** 2)
    
    # 2. Design Radial Ice Thickness (t_design)
    sa = 1.3
    kh = 1.15 if is_transmission else 1.0
    t_design = t_t_mm * sa * kh
    
    # 3. Ice Unit Weight (gR) in N/m (Glaze density = 900 kg/m³)
    g_r = 0.0277 * t_design * (t_design + cond_diameter_mm)
    
    # 4. Joint-Probability Combinations C1 & C2
    # C1: Heavy Ice + 40% Wind
    w_c1 = 0.4 * w_t_kmh
    q0_c1 = 0.5 * (1.225 * 1.10) * ((w_c1 / 3.6) ** 2)
    
    # C2: 50% Ice Weight + 60% Wind
    w_c2 = 0.6 * w_t_kmh
    q0_c2 = 0.5 * (1.225 * 1.10) * ((w_c2 / 3.6) ** 2)
    g_r_c2 = 0.5 * g_r
    
    # Back-calculate reduced ice thickness for C2
    t_reduced = 0.5 * ((math.sqrt((cond_diameter_mm ** 2) + (4 * g_r_c2 / 0.0277))) - cond_diameter_mm)
    
    return {
        "q0_pa": q0,
        "t_design_mm": t_design,
        "g_r_nm": g_r,
        "c1_w_kmh": w_c1,
        "c1_q0_pa": q0_c1,
        "c2_w_kmh": w_c2,
        "c2_q0_pa": q0_c2,
        "c2_t_mm": t_reduced
    }

# ==========================================
# MODULE 4: DETERMINISTIC SAFETY GUARDRAIL
# ==========================================
DETERMINISTIC_MINIMUMS = {
    "SEVERE":   {"t_min_mm": 19.0, "q_min_pa": 400.0},
    "HEAVY":    {"t_min_mm": 12.5, "q_min_pa": 400.0},
    "MEDIUM_A": {"t_min_mm": 6.5,  "q_min_pa": 400.0},
    "MEDIUM_B": {"t_min_mm": 12.5, "q_min_pa": 300.0}
}

def apply_deterministic_guardrails(physics_results: Dict[str, float], district: str) -> Dict[str, float]:
    """Compare physical calculations against CSA Table 30 deterministic legal minimums."""
    mins = DETERMINISTIC_MINIMUMS.get(district.upper())
    if not mins:
        raise ValueError(f"Unknown loading district: {district}")
    
    governed = dict(physics_results)
    governed["q0_pa"] = max(physics_results["q0_pa"], mins["q_min_pa"])
    governed["t_design_mm"] = max(physics_results["t_design_mm"], mins["t_min_mm"])
    return governed

# ==========================================
# MODULE 5: AEOLIAN VIBRATION & TENSION
# ==========================================
def get_max_catenary_constant(ruling_span_m: float, has_dampers: bool = True) -> float:
    """Determine maximum allowable unloaded initial catenary constant C per CSA Table 33."""
    if not has_dampers:
        return 1200.0  # Conservative threshold without dampers
    
    if ruling_span_m > 400:   return 2000.0
    elif ruling_span_m > 350: return 1900.0
    elif ruling_span_m > 300: return 1800.0
    elif ruling_span_m > 250: return 1700.0
    elif ruling_span_m > 200: return 1600.0
    elif ruling_span_m > 150: return 1500.0
    elif ruling_span_m > 100: return 1400.0
    else:                     return 1300.0

# ==========================================
# MODULE 6: PLS-CADD CRITERIA EXPORTER
# ==========================================
CRITERIA_TEMPLATE = """\
; PLS-CADD CRITERIA FILE - GENERATED AUTOMATICALLY
; PROVENANCE: Location={location_name}, ReturnPeriod={return_period}yr, StationTemp={t_jan}C

WEATHER_CASES
; Description | Q | WindSpeed | IceCm | IceDensity | WireTemp | GRF | Model
'{return_period}Yr Extreme Wind'   0.049   {w_extreme:.2f}   0.00   0.00   -10.0   1.0   'CAN/CSA-C22.3 No. 60826-10'
'C1: Heavy Ice + Wind' 0.049   {w_c1:.2f}   {ice_c1_cm:.2f}   0.90   -10.0   1.0   'CAN/CSA-C22.3 No. 60826-10'
'C2: Red. Ice + Wind'  0.049   {w_c2:.2f}   {ice_c2_cm:.2f}   0.90   -10.0   1.0   'CAN/CSA-C22.3 No. 60826-10'
'Everyday Cold (Jan)'  0.049    0.00   0.00   0.00   {t_jan:.1f}   1.0   'None'

STRUCTURE_LOADS
; Description | Weather Case | Cable Condition | LFV | LFW | LFT | LFS | Steel | Wood | Wind Model
'Extreme Wind Case'   '{return_period}Yr Extreme Wind'   'Initial FE'   1.0   1.0   1.0   1.0   1.00   0.75   'CAN/CSA-C22.3 No. 60826-10'
'Combined C1 Case'    'C1: Heavy Ice + Wind' 'Initial FE'   1.0   1.0   1.0   1.0   1.00   0.75   'CAN/CSA-C22.3 No. 60826-10'
'Combined C2 Case'    'C2: Red. Ice + Wind'  'Initial FE'   1.0   1.0   1.0   1.0   1.00   0.75   'CAN/CSA-C22.3 No. 60826-10'

CABLE_TENSION_LIMITS
; Weather Case | Condition | Max Tension (% RTS) | Max Catenary (m)
'C1: Heavy Ice + Wind' 'Initial FE'   60.0   0.0
'Everyday Cold (Jan)'  'Initial FE'    0.0   {max_catenary:.1f}
'Everyday Cold (Jan)'  'Creep FE'     75.0   0.0
"""

def generate_cri_file(output_filepath: str, station_key: str, return_period: int, district: str, ruling_span_m: float, cond_diameter_mm: float) -> None:
    """Execute end-to-end pipeline and export formatted Windows ASCII .cri file."""
    # Pipeline execution
    base = get_location_baseline(station_key)
    w_t, t_t = scale_weather_parameters(base["w50_kmh"], base["t50_mm"], return_period)
    phys = calculate_physics(w_t, t_t, cond_diameter_mm)
    gov = apply_deterministic_guardrails(phys, district)
    max_c = get_max_catenary_constant(ruling_span_m)
    
    # Format template fields (convert mm to cm for PLS-CADD metric ice)
    rendered = CRITERIA_TEMPLATE.format(
        location_name=base["name"],
        return_period=return_period,
        t_jan=base["t_jan_c"],
        w_extreme=w_t,
        w_c1=gov["c1_w_kmh"],
        ice_c1_cm=gov["t_design_mm"] / 10.0,
        w_c2=gov["c2_w_kmh"],
        ice_c2_cm=gov["c2_t_mm"] / 10.0,
        max_catenary=max_c
    )
    
    # Write ASCII file with Windows line endings (\r\n)
    with open(output_filepath, "w", encoding="ascii", newline="\r\n") as f:
        f.write(rendered)

if __name__ == "__main__":
    # Worked Example Execution: Ottawa 150-Year Line
    generate_cri_file(
        output_filepath="Ottawa_150Yr_Criteria.cri",
        station_key="OTTAWA_CITY_HALL",
        return_period=150,
        district="HEAVY",
        ruling_span_m=250.0,
        cond_diameter_mm=28.14
    )
    print("Successfully generated PLS-CADD criteria file: Ottawa_150Yr_Criteria.cri")
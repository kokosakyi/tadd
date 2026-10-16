# Software Specification & Implementation Guide: CSA Weather Loading Criteria App Modules for PLS-CADD

This specification details the mathematical models, software modules, and database structures required to develop a Canadian weather loading criteria application. All calculations are strictly grounded in **CAN/CSA-C22.3 No. 60826-10 (Reliability-Based Design)** and **CSA C22.3 No. 1-15 (Overhead Systems)**. 

Every calculated value is mapped directly to its corresponding input parameter inside the PLS-CADD Criteria (`.cri`) file, with exact reference clauses and tables.

---

## 1. System Architecture Overview

The software is structured as seven independent, interoperable modules:

```
[User Input] ──> [Module 1: GeoDB] ──> [Module 2: RPScaling]
                     │                        │
                     ▼                        ▼
         [Module 4: Deterministic] ──> [Module 3: PhysicsEngine]
                     │                        │
                     ▼                        ▼
         [Module 5: TensionLimits] ──> [Module 6: StructLoads] ──> [Module 7: CRIExporter]
```

---

## Module 1: Geolocation Climatological Database (`ModuleGeoDB`)

### 1. Climatological & Engineering Basis
This module houses the baseline extreme weather parameters for Canadian locations. The baseline parameters represent a **50-year Mean Recurrence Interval (MRI)** at a standard height of 10 m above ground level in open terrain (Category B).

*   **Database Source:** CAN/CSA-C22.3 No. 60826-10, Table CA.1 (Weather Data) [100].
*   **Extreme Minimum Temperatures:** Determined based on the lowest January hourly temperatures to a 1% exclusion limit [100].
*   **Wet Snow Baseline:** Table CA.1 provides 50-year return wet snow thickness for designated regions (conincident temperature is $-5	ext{ °C}$ and density is $350	ext{ kg/m}^3$) [100].

### 2. Code Implementation (Python / SQL)
```python
import sqlite3
from typing import Dict, Any

class ModuleGeoDB:
    def __init__(self, db_path: str = "csa_weather.db"):
        self.db_path = db_path
        self._initialize_db()

    def _initialize_db(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS canadian_cities (
                    city_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    province TEXT NOT NULL,
                    city TEXT NOT NULL UNIQUE,
                    latitude REAL NOT NULL,
                    longitude TEXT NOT NULL,
                    min_temp_jan_1pct INTEGER NOT NULL,
                    wind_50yr_kmh INTEGER NOT NULL,
                    ice_50yr_mm INTEGER NOT NULL,
                    wet_snow_50yr_mm INTEGER
                )
            """)
            # Populate benchmark Ottawa data from Table CA.1 [100, 108]
            cursor.execute("""
                INSERT OR IGNORE INTO canadian_cities 
                (province, city, latitude, longitude, min_temp_jan_1pct, wind_50yr_kmh, ice_50yr_mm, wet_snow_50yr_mm)
                VALUES ('Ontario', 'Ottawa', 45.42, '-75.69', -27, 90, 30, 0)
            """)
            conn.commit()

    def query_location_baselines(self, city_name: str) -> Dict[str, Any]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM canadian_cities WHERE city = ?", (city_name,))
            row = cursor.fetchone()
            if not row:
                raise ValueError(f"City '{city_name}' not found in the CSA Table CA.1 database.")
            return dict(row)
```

### 3. Direct PLS-CADD `.cri` File Mapping
*   **`min_temp_jan_1pct`** $ightarrow$ Maps to the **Wire Temp** column in the Everyday/Uplift weather case lines (`Criteria > Weather...`) [339].
*   **`wind_50yr_kmh` & `ice_50yr_mm`** $ightarrow$ Do not map directly to PLS-CADD in their raw state. They are passed as inputs to **Module 2** and **Module 3** for return period scaling and spatial/height physics adjustments.

---

## Module 2: Return Period Climatic Scaling (`ModuleRPScaling`)

### 1. Climatological & Engineering Basis
Calculates the reliability scaling factors to adjust standard 50-year return weather variables to the line’s target design reliability return period $T$.

*   **Reference Clauses:** CAN/CSA-C22.3 No. 60826-10 Clause 5.2.1 and Table CA.2 [81, 101, 120].
*   **Scaling Factor Rules:** Scaling is performed using Gumbel distribution factors [138]. For intermediate return periods, direct linear interpolation between Table CA.2 points is required [81].

### 2. Code Implementation
```python
class ModuleRPScaling:
    # Table CA.2 raw mappings [101, 102, 120]
    TABLE_CA2 = {
        25:  {"Tw": 0.95, "Ti": 0.87},
        50:  {"Tw": 1.00, "Ti": 1.00},
        100: {"Tw": 1.07, "Ti": 1.13},
        150: {"Tw": 1.10, "Ti": 1.20},
        200: {"Tw": 1.14, "Ti": 1.26},
        400: {"Tw": 1.18, "Ti": 1.38},
        500: {"Tw": 1.20, "Ti": 1.42}
    }

    @staticmethod
    def get_scaling_factors(T: int) -> Dict[str, float]:
        if T in ModuleRPScaling.TABLE_CA2:
            return ModuleRPScaling.TABLE_CA2[T]
        
        # Perform compliant linear interpolation [81]
        sorted_keys = sorted(ModuleRPScaling.TABLE_CA2.keys())
        if T < sorted_keys[0] or T > sorted_keys[-1]:
            raise ValueError(f"Target return period T={T} years is outside of compliant CSA Table CA.2 bounds.")
            
        for i in range(len(sorted_keys) - 1):
            k1, k2 = sorted_keys[i], sorted_keys[i+1]
            if k1 < T < k2:
                v1, v2 = ModuleRPScaling.TABLE_CA2[k1], ModuleRPScaling.TABLE_CA2[k2]
                fraction = (T - k1) / (k2 - k1)
                Tw = v1["Tw"] + fraction * (v2["Tw"] - v1["Tw"])
                Ti = v1["Ti"] + fraction * (v2["Ti"] - v1["Ti"])
                return {"Tw": round(Tw, 3), "Ti": round(Ti, 3)}
        raise RuntimeError("Return period scaling interpolation failed.")

    def scale_baselines(self, v_50: float, t_50: float, T: int) -> Dict[str, float]:
        factors = self.get_scaling_factors(T)
        return {
            "V_T": v_50 * factors["Tw"],  # Scaled 10-minute average wind speed [81]
            "t_T": t_50 * factors["Ti"]   # Scaled equivalent radial ice thickness [89, 115]
        }
```

### 3. Direct PLS-CADD `.cri` File Mapping
*   **`V_T` (Design Wind Speed)** $ightarrow$ Mapped to the **Wind Velocity** column in the Weather Cases table for the Extreme Wind load case [312, 338].
*   **`t_T` (Design Return Period Ice)** $ightarrow$ Serves as the starting point for spatial/height adjustments before mapping to **Wire Ice Thickness**.

---

## Module 3: CAN/CSA-C22.3 No. 60826 Physics Engine (`Module60826Physics`)

### 1. Climatological & Engineering Basis
Applies spatial and elevation factors to determine the ultimate dynamic wind pressure ($q_0$) and design radial ice thickness ($t_{design}$), and solves the coincident wind/ice combinations (C1 and C2).

*   **Air Density Wind-Only ($	au = 1.04$):** Standard conditions at cold extreme wind temperatures [94, 117].
*   **Air Density Wind-on-Ice ($	au = 1.10$):** Colder conditions associated with glaze ice persistence ($-10	ext{ °C}$) [82, 110, 125].
*   **Icing Spatial & Height Adjustments:** Mapped ice must be adjusted by a spatial factor ($1.3$) to account for geographic spans, and a height factor ($1.15$) if wire heights exceed 10 m (combined factor $S_a = 1.5$ for transmission, $1.3$ for distribution) [86, 88, 89].
*   **Vertical Ice Weight Formula:** 
    $$g_R = 0.0277 	imes t_{design} 	imes (t_{design} + d) \quad [	ext{N/m}]$$ [88, 145].
*   **Combination C1 (High Ice + Low Wind):** Design ice thickness $= t_{design}$; coincident wind velocity $= 40\%$ of design wind velocity ($V_T$); dynamic pressure $q_{0H} = 0.5 	imes 1.225 	imes 1.1 	imes (V_{coincident})^2$ [107, 112].
*   **Combination C2 (Reduced Ice + High Wind):** Design ice weight $g_H = 0.5 	imes g_R$; coincident wind velocity $= 60\%$ of $V_T$; dynamic pressure $q_{0L} = 0.5 	imes 1.225 	imes 1.1 	imes (V_{coincident})^2$ [107, 111, 113].

### 2. Code Implementation
```python
import math

class Module60826Physics:
    @staticmethod
    def calculate_wind_only_pressure(V_T_kmh: float) -> float:
        # Dynamic reference pressure: q0 = 0.049 * V^2 (incorporates tau=1.04) [94, 95, 118]
        return 0.049 * (V_T_kmh ** 2)

    @staticmethod
    def calculate_design_ice_thickness(t_T_mm: float, line_type: str = "transmission") -> float:
        # S_a = 1.5 for transmission (height >= 30m), 1.3 for distribution [88, 89, 107]
        S_a = 1.5 if line_type.lower() == "transmission" else 1.3
        return t_T_mm * S_a

    @staticmethod
    def calculate_ice_weight(t_design_mm: float, d_mm: float) -> float:
        # g_R = 0.0277 * t * (t + d) [88, 145]
        return 0.0277 * t_design_mm * (t_design_mm + d_mm)

    def calculate_combined_cases(self, V_T_kmh: float, t_design_mm: float, d_mm: float) -> Dict[str, Any]:
        # Convert design wind velocity from km/h to m/s [109, 125]
        V_T_ms = V_T_kmh / 3.6
        
        # 1. Combination C1 (High Ice + Low Wind) [112]
        V_c1_ms = 0.40 * V_T_ms  # 40% coincident wind [107, 111]
        q_0H = 0.5 * 1.225 * 1.10 * (V_c1_ms ** 2)  # Coincident tau = 1.10 [82, 110]
        
        # 2. Combination C2 (Reduced Ice + High Wind) [113]
        g_R = self.calculate_ice_weight(t_design_mm, d_mm)
        g_H = 0.5 * g_R  # 50% coincident ice weight [111, 113]
        
        # Solve quadratic for equivalent coincident ice thickness t_H
        # 0.0277 * t_H^2 + 0.0277 * d * t_H - g_H = 0
        a = 0.0277
        b = 0.0277 * d_mm
        c = -g_H
        t_H = (-b + math.sqrt(b**2 - 4*a*c)) / (2*a)
        
        V_c2_ms = 0.60 * V_T_ms  # 60% coincident wind [107, 111]
        q_0L = 0.5 * 1.225 * 1.10 * (V_c2_ms ** 2)
        
        return {
            "C1": {"ice_thickness_mm": t_design_mm, "wind_pressure_pa": q_0H, "temp_c": -10.0},
            "C2": {"ice_thickness_mm": t_H, "wind_pressure_pa": q_0L, "temp_c": -10.0}
        }
```

### 3. Direct PLS-CADD `.cri` File Mapping
*   **`q_0` (Wind-Only Pressure)** $ightarrow$ Enter under the **Wind Pressure** column in `Criteria > Weather` [338].
*   **`t_design_mm` (Spatial Adjusted Ice)** $ightarrow$ Enter under the **Wire Ice Thickness** column in `Criteria > Weather` [338]. Convert to **cm** if PLS-CADD SI units are active [300].
*   **`C1` / `C2` Wind Pressure & Ice Thickness** $ightarrow$ Entered in their respective rows in the **Weather Cases** table [337].

---

## Module 4: Deterministic Minimums Compliance (`ModuleDeterministicMin`)

### 1. Climatological & Engineering Basis
Checks the calculated reliability-based loads against the mandated minimum deterministic loading areas in Canada to ensure legal regulatory compliance.

*   **Governing Standard:** CSA C22.3 No. 1-15 Clause 7.2 & Table 30 (Deterministic Weather Loads) [30, 52].
*   **Compliance Rule:** The design loading must equal or exceed the minimum parameters defined for the target geographic loading area [31, 52].

### 2. Code Implementation
```python
class ModuleDeterministicMin:
    # Table 30 Deterministic districts [53]
    LOADING_DISTRICTS = {
        "Severe":    {"ice_mm": 19.0, "wind_pa": 400.0, "temp_c": -20.0},
        "Heavy":     {"ice_mm": 12.5, "wind_pa": 400.0, "temp_c": -20.0},
        "Medium_A":  {"ice_mm": 6.5,  "wind_pa": 400.0, "temp_c": -20.0},
        "Medium_B":  {"ice_mm": 12.5, "wind_pa": 300.0, "temp_c": -20.0}
    }

    def enforce_compliance(self, calculated_ice: float, calculated_wind_pa: float, 
                           district: str) -> Dict[str, float]:
        if district not in self.LOADING_DISTRICTS:
            raise ValueError(f"Invalid CSA district: '{district}'")
            
        limits = self.LOADING_DISTRICTS[district]
        
        # Enforce legislated minimums as floor parameters [31, 60]
        final_ice = max(calculated_ice, limits["ice_mm"])
        final_wind = max(calculated_wind_pa, limits["wind_pa"])
        
        return {
            "final_ice_thickness_mm": final_ice,
            "final_wind_pressure_pa": final_wind,
            "temp_c": limits["temp_c"]
        }
```

### 3. Direct PLS-CADD `.cri` File Mapping
*   **`final_ice_thickness` & `final_wind_pressure`** $ightarrow$ Replaces and overrides calculated reliability values in `Criteria > Weather` if baseline values fall below Table 30 parameters [52].

---

## Module 5: Conductor Tension & Aeolian Vibration Engine (`ModuleTensionLimits`)

### 1. Climatological & Engineering Basis
Establishes mechanical tension limits to suppress high-frequency fatigue caused by aeolian vibration, and limits tension under peak loads to prevent plastic conductor strain.

*   **Aeolian Vibration Limits:** Clause 8.7.3.1.1 recommends limiting the initial catenary parameter ($C = T_{initial}/w$) to **2000 m** (single conductor) or **2200 m** (bundled conductors) for lines with standard vibration dampers [42, 68].
*   **Tension Limits (RTS%):** Mapped against CSA No. 1 Table 34 [57]:
    *   Maximum loaded tension under weather cases $\le 60\%$ RTS [57].
    *   Maximum initial unloaded tension at mean annual temperature $\le 20\%$ RTS [57].
    *   Maximum final unloaded tension at mean annual temperature $\le 15\%$ RTS [57].

### 2. Code Implementation
```python
class ModuleTensionLimits:
    def __init__(self, rts_n: float, unit_weight_nm: float, is_bundled: bool = False):
        self.rts = rts_n
        self.w = unit_weight_nm
        self.is_bundled = is_bundled

    def get_tension_limits(self) -> Dict[str, Any]:
        # 1. Aeolian vibration catenary limits [42, 68]
        max_c = 2200.0 if self.is_bundled else 2000.0
        max_tension_vibe_n = max_c * self.w
        
        # 2. Table 34 RTS Tension limits [57]
        limit_loaded = 0.60 * self.rts
        limit_init_unloaded = 0.20 * self.rts
        limit_final_unloaded = 0.15 * self.rts
        
        return {
            "max_catenary_constant_m": max_c,
            "aeolian_tension_limit_n": max_tension_vibe_n,
            "max_loaded_tension_limit_n": limit_loaded,
            "max_initial_unloaded_tension_n": limit_init_unloaded,
            "max_final_unloaded_tension_n": limit_final_unloaded
        }
```

### 3. Direct PLS-CADD `.cri` File Mapping
Open the Cable Tension Criteria Table (`Criteria > Cable Tensions...`) [342]:
*   **`max_catenary_constant_m`** $ightarrow$ Enter in the **Maximum Catenary** column for everyday Initial/Creep weather cases [342].
*   **`max_loaded_tension_limit_n`** $ightarrow$ Enter **60.00** in the **% of Ultimate** column for the design peak weather case under the **Initial RS** cable condition [342].
*   **`max_initial_unloaded_tension_n`** $ightarrow$ Enter **20.00** in **% of Ultimate** for everyday temperature cases under the **Initial RS** condition [343].
*   **`max_final_unloaded_tension_n`** $ightarrow$ Enter **15.00** in **% of Ultimate** for everyday temperature cases under the **Creep RS** condition [344].

---

## Module 6: Non-Linear Structure Loads & Material LRFD Mapper (`ModuleStructureLoads`)

### 1. Climatological & Engineering Basis
Applies non-linear structure load factors and component strength reduction factors to map structural capacity limit states.

*   **Non-Linear Load Factors:** Mapped from CSA No. 1 Table 31 [54, 55]. Load factors are based on the Grade of Construction (Grade 1, 2, or 3) and the structure material's Coefficient of Variation (COV) [54, 55]:
    *   **Steel ($COV \le 10\%$):** Vertical = 1.30, Transverse = 1.20, Longitudinal (with terminations) = 1.20 [54, 55].
    *   **Concrete ($10\% < COV < 15\%$):** Vertical = 1.60, Transverse = 1.50, Longitudinal = 1.50 [54, 55].
    *   **Wood ($COV \ge 15\%$):** Vertical = 2.00, Transverse = 1.90, Longitudinal = 1.90 [54, 55].
*   **Strength Reduction Factors ($\phi$):** Standard LRFD component resistance factors (e.g., $1.00$ for steel poles/arms, $0.75$ for wood poles, and $0.90$ for guys) [179, 357, 358, 359].

### 2. Code Implementation
```python
class ModuleStructureLoads:
    # Table 31 raw factor lookup (Grade 1 construction) [54, 55]
    TABLE_31_GRADE1 = {
        "steel":    {"LFV": 1.30, "LFW": 1.20, "LFT": 1.20},
        "concrete": {"LFV": 1.60, "LFW": 1.50, "LFT": 1.50},
        "wood":     {"LFV": 2.00, "LFW": 1.90, "LFT": 1.90}
    }

    def get_lrfd_criteria(self, material: str) -> Dict[str, float]:
        mat_lower = material.lower()
        if mat_lower not in self.TABLE_31_GRADE1:
            raise ValueError(f"Unsupported material: '{material}'")
            
        factors = self.TABLE_31_GRADE1[mat_lower]
        
        # Component strength factors (phi) [179, 357, 358, 359]
        phi = {
            "steel": 1.00,
            "wood": 0.75,
            "guys": 0.90,
            "insulators": 1.00
        }
        
        return {
            "LFV": factors["LFV"],  # Vertical Load Factor
            "LFW": factors["LFW"],  # Wind Load Factor
            "LFT": factors["LFT"],  # Tension Load Factor
            "phi_steel": phi["steel"],
            "phi_wood": phi["wood"],
            "phi_guys": phi["guys"],
            "phi_insulators": phi["insulators"]
        }
```

### 3. Direct PLS-CADD `.cri` File Mapping
Open the Structure Loads Criteria Table (`Criteria > Structure Loads (method 4)...`) [366]:
*   **`LFV`, `LFW`, `LFT`** $ightarrow$ Input directly into the **Vertical (LFV)**, **Wind (LFW)**, and **Tension (LFT)** columns for each corresponding load case row [356].
*   **`phi` Values** $ightarrow$ Input directly into the **Strength Factor** columns for **Steel Poles**, **Wood Poles**, **Guys**, and **Insulators** [357, 358, 359, 369].
*   **Structure Wind Model** $ightarrow$ Set to **"CAN/CSA-C22.3 No. 60826-10"** to automatically apply code-compliant exposed drag coefficients ($C_{xt}$) and height factors ($K_z$) inside PLS-POLE or TOWER [317, 328, 368, 642].

---

## Module 7: PLS-CADD `.cri` ASCII File Generator (`ModuleCRIExporter`)

### 1. Engineering Basis
This module acts as the serialization engine. It reads the computed outputs from all prior modules and writes them into a standard ASCII text block formatting that is parsed directly by the PLS-CADD Criteria file parser [297, 305].

### 2. Code Implementation
```python
class ModuleCRIExporter:
    @staticmethod
    def generate_weather_cases_block(cases: list) -> str:
        # Schema matching PLS-CADD Criteria file WEATHER cases block [336]
        lines = []
        lines.append("WEATHER")
        lines.append("# Desc, Q, Wind, Ice, Density, Temp, WLF, ILF, WindModel, GRF")
        for c in cases:
            # Format: string, float, float, float, float, float, int, int, string, string [338]
            lines.append(
                f'"{c["desc"]}" {c["Q"]:.4f} {c["wind"]:.3f} {c["ice"]:.3f} '
                f'{c["density"]:.2f} {c["temp"]:.1f} 1 1 "{c["wind_model"]}" "{c["grf"]}"'
            )
        lines.append("END_WEATHER")
        return "
".join(lines)

    @staticmethod
    def generate_structure_loads_block(loads: list) -> str:
        # Schema matching PLS-CADD Criteria file METHOD 4 structure loads block [366]
        lines = []
        lines.append("STRUCTURE_LOADS_M4")
        lines.append("# Desc, LFV, LFW, LFT, SF_Steel, SF_Wood, SF_Guys, WindModel")
        for l in loads:
            lines.append(
                f'"{l["desc"]}" {l["LFV"]:.2f} {l["LFW"]:.2f} {l["LFT"]:.2f} '
                f'{l["sf_steel"]:.2f} {l["sf_wood"]:.2f} {l["sf_guys"]:.2f} "{l["wind_model"]}"'
            )
        lines.append("END_STRUCTURE_LOADS_M4")
        return "
".join(lines)
```

---

## 2. Integrated Verification Run (Ottawa Distribution Example)

To verify the app's computational math, test the modules against the **CSA 60826-10 Annex CB (Clause CB.3) Ottawa Distribution Pole Example** [106, 108]:

### Input Variables:
*   **City:** Ottawa [108]
*   **Line Type:** Distribution ($S_a = 1.3$) [107, 108]
*   **Conductor Diameter ($d$):** $22	ext{ mm}$ [108]
*   **Wind Baseline ($V_{50}$):** $90	ext{ km/h}$ [108]
*   **Ice Baseline ($t_{50}$):** $30	ext{ mm}$ [108]
*   **Return Period ($T$):** $50	ext{ years}$ ($T_w = 1.0$, $T_i = 1.0$) [101, 108]

### Solved Outputs for Mapped Fields:
1.  **Reference Wind Pressure ($q_0$):** $0.049 	imes 90^2 = \mathbf{396.9	ext{ Pa}}$ (or $\mathbf{421.1	ext{ Pa}}$ if the conservative coincident temperature density factor of $1.1$ is applied globally) [95, 109, 125].
2.  **Design Ice Thickness ($t_{design}$):** $30 	imes 1.3 = \mathbf{39	ext{ mm}}$ [107, 111].
3.  **Ultimate Vertical Ice Weight ($g_R$):** $0.0277 	imes 39 	imes (39 + 22) = \mathbf{65.9	ext{ N/m}}$ [111].
4.  **C1 Coincident Pressure ($q_{0H}$):** $0.5 	imes 1.225 	imes 1.1 	imes (10)^2 = \mathbf{67.4	ext{ Pa}}$ at $39	ext{ mm}$ ice thickness [112].
5.  **C2 Coincident Pressure ($q_{0L}$):** $0.5 	imes 1.225 	imes 1.1 	imes (15)^2 = \mathbf{151.7	ext{ Pa}}$ at $25.2	ext{ mm}$ equivalent ice thickness [113].

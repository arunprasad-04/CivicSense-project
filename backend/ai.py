from typing import Any

from schemas import ReportCreate


def fake_ai(report: ReportCreate) -> dict[str, Any]:
    base = 5.5
    severity = min(10.0, base + (0.8 if report.issue_type == "pothole" else 0.3))
    confidence = 0.82
    return {
        "severity_score": severity,
        "severity_confidence": confidence,
        "damage_metadata": {
            "crack_depth_mm": 12.0,
            "area_sqm": 1.4,
            "hazard_radius_m": 2.0,
            "water_present": False,
        },
        "estimated_cost_usd": int(severity * 500),
    }

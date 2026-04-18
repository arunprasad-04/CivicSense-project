from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import uuid4

from geoalchemy2.elements import WKTElement
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models import Report
from schemas import Location, ReportCreate


def create_report(db: Session, payload: ReportCreate, ai: dict[str, Any]) -> Report:
    report = Report(
        id=str(uuid4()),
        lat=payload.location.lat,
        lng=payload.location.lng,
        location=WKTElement(
            f"POINT({payload.location.lng} {payload.location.lat})", srid=4326
        ),
        address=payload.address,
        issue_type=payload.issue_type,
        description=payload.description,
        photos=payload.photos,
        status="submitted",
        department=_department_from_issue(payload.issue_type),
        severity_score=float(ai.get("severity_score", 0)),
        severity_confidence=float(ai.get("severity_confidence", 0)),
        damage_metadata=ai.get("damage_metadata"),
        created_at=datetime.utcnow(),
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_report(db: Session, report_id: str) -> Report | None:
    return db.get(Report, report_id)


def list_reports(db: Session) -> list[Report]:
    return db.query(Report).order_by(Report.created_at.desc()).all()


def list_reports_nearby(db: Session, location: Location, radius_km: float) -> list[Report]:
    radius_m = radius_km * 1000
    point = func.ST_SetSRID(func.ST_MakePoint(location.lng, location.lat), 4326)
    distance_expr = func.ST_DWithin(
        func.Geography(Report.location),
        func.Geography(point),
        radius_m,
    )
    stmt = select(Report).where(distance_expr).order_by(Report.created_at.desc())
    return list(db.scalars(stmt).all())


def _department_from_issue(issue_type: str) -> str:
    if issue_type in {"pipe", "drainage"}:
        return "utilities"
    if issue_type == "sidewalk":
        return "parks"
    return "roads"

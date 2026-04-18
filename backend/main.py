from __future__ import annotations

from datetime import datetime
from typing import Any, Generator
from uuid import uuid4

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from ai import fake_ai
from crud import create_report, get_report, list_reports, list_reports_nearby
from db import Base, engine, get_db
from schemas import Location, ReportCreate, ReportOut, ReportResponse

app = FastAPI(title="CivicSense API", version="0.2.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DB_AVAILABLE = False
IN_MEMORY_REPORTS: list[ReportOut] = []


@app.on_event("startup")
def on_startup() -> None:
    global DB_AVAILABLE
    try:
        with engine.begin() as connection:
            connection.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
            Base.metadata.create_all(bind=connection)
        DB_AVAILABLE = True
    except Exception:
        DB_AVAILABLE = False


def get_db_optional() -> Generator[Session | None, None, None]:
    if not DB_AVAILABLE:
        yield None
        return
    yield from get_db()


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


def _to_report_out(report: Any) -> ReportOut:
    return ReportOut(
        id=report.id,
        location=Location(lat=report.lat, lng=report.lng),
        address=report.address,
        issue_type=report.issue_type,
        description=report.description,
        photos=report.photos or [],
        status=report.status,
        department=report.department,
        severity_score=report.severity_score,
        severity_confidence=report.severity_confidence,
        damage_metadata=report.damage_metadata,
        created_at=report.created_at.isoformat(),
    )


def _create_in_memory_report(payload: ReportCreate, ai: dict[str, Any]) -> ReportOut:
    now = datetime.utcnow().isoformat()
    report = ReportOut(
        id=str(uuid4()),
        location=payload.location,
        address=payload.address,
        issue_type=payload.issue_type,
        description=payload.description,
        photos=payload.photos,
        status="submitted",
        department="roads",
        severity_score=float(ai.get("severity_score", 0)),
        severity_confidence=float(ai.get("severity_confidence", 0)),
        damage_metadata=ai.get("damage_metadata"),
        created_at=now,
    )
    IN_MEMORY_REPORTS.insert(0, report)
    return report


@app.post("/api/reports", response_model=ReportResponse)
async def submit_report(
    payload: ReportCreate, db: Session | None = Depends(get_db_optional)
) -> ReportResponse:
    ai = fake_ai(payload)
    if db is None:
        report = _create_in_memory_report(payload, ai)
        return ReportResponse(report=report, ai=ai)
    report = create_report(db, payload, ai)
    return ReportResponse(report=_to_report_out(report), ai=ai)


@app.get("/api/reports/{report_id}", response_model=ReportOut)
async def get_report_by_id(
    report_id: str, db: Session | None = Depends(get_db_optional)
) -> ReportOut:
    if db is None:
        for report in IN_MEMORY_REPORTS:
            if report.id == report_id:
                return report
        raise HTTPException(status_code=404, detail="Report not found")
    report = get_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return _to_report_out(report)


@app.get("/api/reports/nearby", response_model=list[ReportOut])
async def get_reports_nearby(
    lat: float = Query(...),
    lng: float = Query(...),
    radius_km: float = Query(1.0, alias="radius"),
    db: Session | None = Depends(get_db_optional),
) -> list[ReportOut]:
    origin = Location(lat=lat, lng=lng)
    if db is None:
        radius_m = radius_km * 1000
        nearby = []
        for report in IN_MEMORY_REPORTS:
            dx = report.location.lat - origin.lat
            dy = report.location.lng - origin.lng
            distance_m = (dx * dx + dy * dy) ** 0.5 * 111_000
            if distance_m <= radius_m:
                nearby.append(report)
        return nearby
    reports = list_reports_nearby(db, origin, radius_km)
    return [_to_report_out(report) for report in reports]


@app.get("/api/citizen/reports", response_model=list[ReportOut])
async def get_citizen_reports(
    db: Session | None = Depends(get_db_optional),
) -> list[ReportOut]:
    if db is None:
        return IN_MEMORY_REPORTS
    reports = list_reports(db)
    return [_to_report_out(report) for report in reports]

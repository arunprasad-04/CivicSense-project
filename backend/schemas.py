from typing import Any

from pydantic import BaseModel, Field


class Location(BaseModel):
    lat: float
    lng: float


class ReportCreate(BaseModel):
    location: Location
    address: str
    issue_type: str
    description: str | None = None
    photos: list[str] = Field(default_factory=list)


class ReportOut(BaseModel):
    id: str
    location: Location
    address: str
    issue_type: str
    description: str | None = None
    photos: list[str]
    status: str
    department: str
    severity_score: float
    severity_confidence: float
    damage_metadata: dict[str, Any] | None = None
    created_at: str


class ReportResponse(BaseModel):
    report: ReportOut
    ai: dict[str, Any]

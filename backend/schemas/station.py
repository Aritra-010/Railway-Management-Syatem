from pydantic import BaseModel

class StationCreate(BaseModel):
    name: str
    code: str
    city: str
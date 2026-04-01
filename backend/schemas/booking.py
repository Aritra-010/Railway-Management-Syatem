from pydantic import BaseModel
from typing import List

class Passenger(BaseModel):
    name: str
    age: int
    gender: str
    coach_type: str

class BookingCreate(BaseModel):
    train_number: str
    source: str
    destination: str
    phone_number: str
    passengers: List[Passenger]
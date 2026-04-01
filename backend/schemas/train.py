from pydantic import BaseModel

class TrainCreate(BaseModel):
    train_number: str
    train_name: str
    train_type: str
    source: str
    destination: str
    total_coaches: int
    total_seats: int

    gs_seats: int = 0
    sl_seats: int = 0
    third_ac_seats: int = 0
    second_ac_seats: int = 0
    first_ac_seats: int = 0
    cc_seats: int = 0
    second_sitting_seats: int = 0
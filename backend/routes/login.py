from fastapi import APIRouter
from pydantic import BaseModel
from db.connection import get_connection

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login_user(data: LoginRequest):
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT id, name, email FROM users WHERE email = %s AND password = %s"
    cursor.execute(query, (data.email, data.password))

    user = cursor.fetchone()

    if user:
        return {
            "message": "Login successful",
            "user": {
                "id": user[0],
                "name": user[1],
                "email": user[2]
            }
        }
    else:
        return {"message": "Invalid email or password"}
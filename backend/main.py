from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.admin import station, train
from routes.user import train as user_train
from routes.user import ticket_booking
from routes.user import my_booking

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Admin routes
app.include_router(station.router, prefix="/admin")
app.include_router(train.router, prefix="/admin")

# User routes
app.include_router(user_train.router, prefix="/user")
app.include_router(ticket_booking.router, prefix="/user/ticket-booking")
app.include_router(my_booking.router, prefix="/user/my-bookings")

@app.get("/")
def root():
    return {"message": "Backend running 🚆"}
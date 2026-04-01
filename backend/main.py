from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.admin import station, train
from routes.user import train as user_train
from routes.user import booking


app = FastAPI()

#  CORS setup (updated)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(station.router, prefix="/admin")
app.include_router(train.router, prefix="/admin")
app.include_router(user_train.router, prefix="/user")
app.include_router(booking.router, prefix="/user")

@app.get("/")
def root():
    return {"message": "Backend running 🚆"}
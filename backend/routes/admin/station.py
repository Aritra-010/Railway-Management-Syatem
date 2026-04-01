from fastapi import APIRouter
from db.connection import get_connection
from schemas.station import StationCreate

router = APIRouter()

@router.post("/add-station")
def add_station(station: StationCreate):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        query = """
        INSERT INTO stations (name, code, city)
        VALUES (%s, %s, %s);
        """
        cursor.execute(query, (
            station.name,
            station.code,
            station.city
        ))
        conn.commit()

        return {"message": "Station added successfully"}

    except Exception:
        conn.rollback()
        return {"error": "Station code already exists or invalid data"}

    finally:
        cursor.close()
        conn.close()

@router.get("/stations")
def get_stations():
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT name, code, city FROM stations;"
    cursor.execute(query)

    rows = cursor.fetchall()

    stations = []
    for row in rows:
        stations.append({
            "name": row[0],
            "code": row[1],
            "city": row[2]
        })

    cursor.close()
    conn.close()

    return stations
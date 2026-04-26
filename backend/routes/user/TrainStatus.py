from fastapi import APIRouter
from db.connection import get_connection

router = APIRouter()

# 🔹 GET STATIONS
@router.get("/stations")
def get_stations():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT name FROM stations;")
        rows = cursor.fetchall()

        stations = [row[0] for row in rows]

        return {"stations": stations}

    except Exception as e:
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()


# 🔹 SEARCH TRAINS
@router.get("/train-status")
def train_status(source: str, destination: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        query = """
        SELECT train_number, train_name
        FROM trains
        WHERE LOWER(source) = LOWER(%s)
        AND LOWER(destination) = LOWER(%s);
        """

        cursor.execute(query, (source, destination))
        rows = cursor.fetchall()

        trains = []
        for row in rows:
            trains.append({
                "train_number": row[0],
                "train_name": row[1]
            })

        return {"trains": trains}

    except Exception as e:
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()
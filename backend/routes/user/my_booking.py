from fastapi import APIRouter
from db.connection import get_connection

router = APIRouter()


@router.get("/{pnr}")
def get_booking_by_pnr(pnr: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        query = """
        SELECT 
            pnr, train_name, train_number,
            source, destination,
            journey_date,
            passengers,
            coach, seat_numbers,
            total_fare
        FROM bookings
        WHERE pnr = %s
        """

        cursor.execute(query, (pnr,))
        row = cursor.fetchone()

        if not row:
            return {"error": "Booking not found"}

        booking = {
            "pnr": row[0],
            "train_name": row[1],
            "train_number": row[2],
            "source": row[3],
            "destination": row[4],
            "journey_date": str(row[5]),
            "passengers": row[6],
            "coach": row[7],
            "seat_numbers": row[8],
            "total_fare": row[9]
        }

        return booking

    except Exception as e:
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()
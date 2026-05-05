from fastapi import APIRouter
from db.connection import get_connection

router = APIRouter()


@router.get("/{pnr}")
def get_booking_by_pnr(pnr: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT 
                pnr, train_name, train_number,
                source, destination,
                journey_date,
                pass_name, pass_age, pass_gender,
                coach, seat_numbers,
                total_fare
            FROM bookings
            WHERE pnr = %s
        """, (pnr,))

        rows = cursor.fetchall()

        if not rows:
            return {"error": "Booking not found"}

        # Common info (same for all rows)
        first = rows[0]

        booking = {
            "pnr": first[0],
            "train_name": first[1],
            "train_number": first[2],
            "source": first[3],
            "destination": first[4],
            "journey_date": str(first[5]),
            "coach": first[9],
            "seat_numbers": first[10],
            "total_fare": first[11],
            "total_passengers": len(rows),
            "passengers": [
                {
                    "name": r[6],
                    "age": r[7],
                    "gender": r[8]
                } for r in rows
            ]
        }

        return booking

    except Exception as e:
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()
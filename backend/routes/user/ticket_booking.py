from fastapi import APIRouter, Query
from db.connection import get_connection
from schemas.booking import BookingRequest

import random
import json

router = APIRouter()

#  SEARCH TRAINS
@router.get("/search")
def search_trains(
    source: str = Query(...),
    destination: str = Query(...)
):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        query = """
        SELECT id, train_name, train_number
        FROM trains
        WHERE LOWER(TRIM(source)) = LOWER(TRIM(%s))
        AND LOWER(TRIM(destination)) = LOWER(TRIM(%s))
        """

        cursor.execute(query, (source, destination))
        rows = cursor.fetchall()

        trains = []
        for row in rows:
            trains.append({
                "train_id": row[0],
                "train_name": row[1],
                "train_number": row[2]
            })

        return {"trains": trains}

    except Exception as e:
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()


#  GET TRAIN DETAILS (Book button)
@router.get("/train-details/{train_id}")
def get_train_details(train_id: int, date: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        query = """
        SELECT train_name, train_number, source, destination
        FROM trains
        WHERE id = %s
        """

        cursor.execute(query, (train_id,))
        train = cursor.fetchone()

        if not train:
            return {"error": "Train not found"}

        return {
            "train_id": train_id,
            "train_name": train[0],
            "train_number": train[1],
            "source": train[2],
            "destination": train[3],
            "journey_date": date
        }

    except Exception as e:
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()

# PNR generate
def generate_pnr():
    return "PNR" + str(random.randint(100000, 999999))

def generate_seats(count):
    coach = "S" + str(random.randint(1, 5))
    seats = [str(random.randint(1, 72)) for _ in range(count)]
    return coach, ",".join(seats)


#  CONFIRM BOOKING (MAIN API)
@router.post("/confirm")
def confirm_booking(data: BookingRequest):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Get train details
        cursor.execute("""
            SELECT train_name, train_number, source, destination
            FROM trains
            WHERE id = %s
        """, (data.train_id,))
        
        train = cursor.fetchone()

        if not train:
            return {"error": "Train not found"}

        # Generate common values
        pnr = generate_pnr()
        coach, seat_numbers = generate_seats(len(data.passengers))
        total_fare = 200 * len(data.passengers)

        # 🔥 INSERT ONE ROW PER PASSENGER
        for p in data.passengers:
            cursor.execute("""
                INSERT INTO bookings (
                    pnr, train_id, train_name, train_number,
                    source, destination, journey_date,
                    phone_number,
                    pass_name, pass_age, pass_gender, coach_type,
                    coach, seat_numbers,
                    total_fare, status
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                pnr,
                data.train_id,
                train[0],
                train[1],
                train[2],
                train[3],
                data.journey_date,
                data.phone_number,
                p.name,
                p.age,
                p.gender,
                p.coach_type,
                coach,
                seat_numbers,
                total_fare,
                "CONFIRMED"
            ))

        conn.commit()

        return {
            "message": "Ticket Booked Successfully",
            "pnr": pnr,
            "status": "CONFIRMED",
            "coach": coach,
            "seat_numbers": seat_numbers,
            "total_fare": total_fare
        }

    except Exception as e:
        conn.rollback()
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()
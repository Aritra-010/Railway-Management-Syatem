from fastapi import APIRouter
from db.connection import get_connection
from schemas.booking import BookingCreate
import random

router = APIRouter()

def generate_pnr():
    return "PNR" + str(random.randint(100000, 999999))


@router.post("/book-ticket")
def book_ticket(data: BookingCreate):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        pnr = generate_pnr()
        total_passengers = len(data.passengers)

        # 1️⃣ Insert booking
        booking_query = """
        INSERT INTO bookings (
            pnr, train_number, source, destination,
            total_passengers, phone_number
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id;
        """

        cursor.execute(booking_query, (
            pnr,
            data.train_number,
            data.source,
            data.destination,
            total_passengers,
            data.phone_number
        ))

        booking_id = cursor.fetchone()[0]

        # 2️⃣ Insert passengers
        passenger_query = """
        INSERT INTO passengers (
            booking_id, name, age, gender, coach_type
        )
        VALUES (%s, %s, %s, %s, %s);
        """

        for p in data.passengers:
            cursor.execute(passenger_query, (
                booking_id,
                p.name,
                p.age,
                p.gender,
                p.coach_type
            ))

        # 🔥 3️⃣ Update seats (CORRECT PLACE)

        seat_count = {}

        for p in data.passengers:
            seat_count[p.coach_type] = seat_count.get(p.coach_type, 0) + 1

        for coach, count in seat_count.items():

            if coach == "SL":
                cursor.execute("""
                    UPDATE trains
                    SET available_sl_seats = available_sl_seats - %s
                    WHERE train_number = %s;
                """, (count, data.train_number))

            elif coach == "3A":
                cursor.execute("""
                    UPDATE trains
                    SET available_3a_seats = available_3a_seats - %s
                    WHERE train_number = %s;
                """, (count, data.train_number))

            elif coach == "2A":
                cursor.execute("""
                    UPDATE trains
                    SET available_2a_seats = available_2a_seats - %s
                    WHERE train_number = %s;
                """, (count, data.train_number))

            elif coach == "1A":
                cursor.execute("""
                    UPDATE trains
                    SET available_1a_seats = available_1a_seats - %s
                    WHERE train_number = %s;
                """, (count, data.train_number))

            elif coach == "GS":
                cursor.execute("""
                    UPDATE trains
                    SET available_gs_seats = available_gs_seats - %s
                    WHERE train_number = %s;
                """, (count, data.train_number))

        # ✅ commit ONCE
        conn.commit()

        return {
            "message": "Booking successful",
            "pnr": pnr
        }

    except Exception as e:
        conn.rollback()
        print("ERROR:", e)
        return {"error": "Booking failed"}

    finally:
        cursor.close()
        conn.close()
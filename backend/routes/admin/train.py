from fastapi import APIRouter
from db.connection import get_connection
from schemas.train import TrainCreate

router = APIRouter()

@router.post("/add-train")
def add_train(train: TrainCreate):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        query = """
        INSERT INTO trains (
            train_number, train_name, train_type, source, destination,
            total_coaches, total_seats,
            gs_seats, sl_seats, third_ac_seats,
            second_ac_seats, first_ac_seats,
            cc_seats, second_sitting_seats
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """

        cursor.execute(query, (
            train.train_number,
            train.train_name,
            train.train_type,
            train.source,
            train.destination,
            train.total_coaches,
            train.total_seats,
            train.gs_seats,
            train.sl_seats,
            train.third_ac_seats,
            train.second_ac_seats,
            train.first_ac_seats,
            train.cc_seats,
            train.second_sitting_seats
        ))

        conn.commit()
        return {"message": "Train added successfully"}

    except Exception as e:
        conn.rollback()
        print("ERROR:", e)  # 👈 very important (see error in terminal)
        return {"error": "Something went wrong (maybe duplicate train number)"}

    finally:
        cursor.close()
        conn.close()
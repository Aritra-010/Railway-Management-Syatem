from fastapi import APIRouter, HTTPException
from db.connection import get_connection
from schemas.train import TrainCreate

router = APIRouter()

@router.post("/add-train")
def add_train(train: TrainCreate):
    print("API HIT")
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # 🔴 1. CHECK DUPLICATE TRAIN
        cursor.execute("""
            SELECT COUNT(*) FROM trains
            WHERE train_number = %s
              AND source = %s
              AND destination = %s
        """, (train.train_number, train.source, train.destination))

        if cursor.fetchone()[0] > 0:
            raise HTTPException(
                status_code=400,
                detail="Train details have already been added"
            )

        # 🔴 2. FORCE TYPE CONVERSION
        gs = int(train.gs_seats or 0)
        sl = int(train.sl_seats or 0)
        third_ac = int(train.third_ac_seats or 0)
        second_ac = int(train.second_ac_seats or 0)
        first_ac = int(train.first_ac_seats or 0)
        cc = int(train.cc_seats or 0)
        second_sitting = int(train.second_sitting_seats or 0)

        total_calculated = (
            gs + sl + third_ac + second_ac + first_ac + cc + second_sitting
        )

        total_given = int(train.total_seats or 0)

        print("Calculated:", total_calculated)
        print("Given:", total_given)

        # 🔴 3. VALIDATION FIX (IMPORTANT)
        if total_given != total_calculated:
            raise HTTPException(
                status_code=400,
                detail=f"Total seats mismatch. Given: {total_given}, Calculated: {total_calculated}"
            )

        # ✅ 4. INSERT TRAIN
        query = """
        INSERT INTO trains (
            train_number, train_name, train_type,
            source, destination,
            total_coaches, total_seats,
            gs_seats, sl_seats, third_ac_seats,
            second_ac_seats, first_ac_seats,
            cc_seats, second_sitting_seats
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(query, (
            train.train_number,
            train.train_name,
            train.train_type,
            train.source,
            train.destination,
            train.total_coaches,
            total_given,
            gs,
            sl,
            third_ac,
            second_ac,
            first_ac,
            cc,
            second_sitting
        ))

        conn.commit()

        return {"message": "Train added successfully"}

    except HTTPException as e:
        # 🔴 VERY IMPORTANT: let FastAPI handle this properly
        raise e

    except Exception as e:
        conn.rollback()
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Failed to add train")

    finally:
        cursor.close()
        conn.close()
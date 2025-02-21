from app.utils.db_utils import connect_db, close_db
import json

def get_food_data(param: str):
    connection = None
    try:
        # แยกคำจาก input โดยใช้การแบ่ง space หรือคีย์เวิร์ด
        keywords = param.split()  # แยกคำจากช่องว่าง (หรือสามารถใช้วิธีอื่นในการแยกคำ)
        
        connection = connect_db()
        with connection.cursor() as cursor:
            query = "SELECT * FROM food_data WHERE "
            conditions = []
            params = []

            # สร้างเงื่อนไขสำหรับแต่ละคำค้น
            for keyword in keywords:
                conditions.append("thai_name LIKE %s")
                params.append(f"%{keyword}%")
            
            # รวมเงื่อนไขทั้งหมดเป็นคำสั่ง SQL
            query += " AND ".join(conditions)

            # ตรวจสอบ query ก่อนที่จะ execute
            print(f"Executing query: {query} with parameters: {params}")

            cursor.execute(query, tuple(params))
            result = cursor.fetchall()

            if result:
                data = []
                for row in result:
                    # แปลงข้อมูลที่ได้รับจากฐานข้อมูล
                    food_item = {
                        'id': row[0],
                        'thai_name': row[3],
                        'eng_name': row[4],
                        'Nutrition': json.loads(row[5])  # แปลง JSON string เป็น list
                    }
                    data.append(food_item)
                close_db(connection)
                return data  # ส่งกลับข้อมูลที่เก็บไว้ใน data
            else:
                return {"message": "No data found"}  # ไม่มีข้อมูลที่ตรงกับคำค้นหา

    except Exception as e:
        print(f"Error: {e}")
        return None
    

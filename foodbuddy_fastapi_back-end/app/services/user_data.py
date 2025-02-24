# ---------------------------------------------------------------------------- #
#                                    ! LIB                                     #
# ---------------------------------------------------------------------------- #
from app.utils.db_utils import connect_db, close_db
import requests
import os
import json
from dotenv import load_dotenv
load_dotenv()
# ---------------------------------------------------------------------------- #


# ---------------------------------------------------------------------------- #
#  !                              DATABASE for user                            #
#? TABLE user_report
#? TABLE user_new_data
#? TABLE users
#? TABLE user_eat_history
#? TABLE incorrect_predictions
# ---------------------------------------------------------------------------- #
# !                              DATABASE for food                             #
#? TABLE food_nutration
#? TABLE food_category
#! --------------------------------------------------------------------------- #


# ---------------------------------------------------------------------------- #
# ?                           บันทึกข้อมูลการทานอาหาร                             #
# ---------------------------------------------------------------------------- #
def save_eat_history(data):
    print(data)
    print(os.getenv('API_USER_HISTORY'))
    try:
        # แปลงข้อมูลให้ตรงกับประเภทที่ต้องการ
        calories = int(data["calories"]) if isinstance(data["calories"], (int, float)) else None
        protein = int(data["protein"]) if isinstance(data["protein"], (int, float)) else None
        carbohydrates = int(data["carbs"]) if isinstance(data["carbs"], (int, float)) else None
        fat = int(data["fat"]) if isinstance(data["fat"], (int, float)) else None
        food_name = str(data["food_name"]) if data["food_name"] else None
        user_lineId = str(data["user_lineId"]) if data["user_lineId"] else None
        category = str(data["food_type"]) if data["food_type"] else None

        # ตรวจสอบว่ามีข้อมูลที่สำคัญครบหรือไม่
        if None in [calories, protein, carbohydrates, fat, food_name, user_lineId, category]:
            return {"error": "Failed to save eat history", "details": "Missing data"}

        # เตรียมข้อมูลที่จะส่งไปยัง API
        payload = {
            "calories": calories,
            "protein": protein,
            "carbohydrates": carbohydrates,
            "fat": fat,
            "food_name": food_name,
            "user_lineId": user_lineId,
            "category": category
        }

        # ส่งข้อมูลไปยัง API
        # response = requests.post("http://localhost:3000/api", json=payload)
        response = requests.post(os.getenv('API_USER_HISTORY'), json=payload)
        
        # ตรวจสอบคำตอบจาก API
        
        response_json = response.json()
        if response_json.get("message") == "success":
            return {"message": "Save eat history successfully", "status": "success"}
        else:
            return {"error": "Failed to save eat history", "details": "Failed to save data"}
      

    except Exception as e:
        print("Error:", str(e))
        return {"error": "Failed to save eat history", "details": str(e)}
    
# ---------------------------------------------------------------------------- #


# ---------------------------------------------------------------------------- #
# !                       เก็บข้อมูลอาหารที่ทานผิดพลาด                              #
# ---------------------------------------------------------------------------- #
def incorrect_predict(data):
    required_keys = ["user_Id", "old_food_name", "new_food_name", "food_type", "nutrition", "image_path"]
    
    # ตรวจสอบว่าคีย์ทั้งหมดมีอยู่ใน data
    missing_keys = [key for key in required_keys if key not in data or data[key] is None]
    
    if missing_keys:
        print(f"Error: Missing required fields: {missing_keys}")
        return {"status": "error", "message": f"Missing required fields: {missing_keys}"}
    
    # ตรวจสอบว่า `nutrition` เป็น JSON ที่ถูกต้องหรือไม่
    if not isinstance(data["nutrition"], dict):
        print("Error: Nutrition data should be a valid dictionary.")
        return {"status": "error", "message": "Invalid nutrition format"}
    
    # ตรวจสอบว่า `image_path` มีค่าเป็นสตริง
    if not isinstance(data["image_path"], str) or not data["image_path"]:
        print("Error: Image path is invalid.")
        return {"status": "error", "message": "Invalid image path"}
    
    # บันทึกข้อมูล (โค้ดสำหรับบันทึกลงฐานข้อมูล)
    print("Data is valid. Saving to database...")

    try:
        # บันทึกข้อมูลลงฐานข้อมูล
        connection = connect_db()
        with connection.cursor() as cursor:
            cursor.execute(f"""
                INSERT INTO incorrect_predictions (user_id, old_food_name, new_food_name, food_type, nutrition, image_path)
                VALUES (%s, %s, %s, %s, %s, %s);
            """, (data["user_Id"], data["old_food_name"], data["new_food_name"], data["food_type"], json.dumps(data["nutrition"]), os.path.basename(data["image_path"])))
            connection.commit()
            close_db(connection)
    except Exception as e:
        print(f"Error: {e}")
        return {"status": "error", "message": f"An unexpected error occurred: {e}"}
    
    
   

    return {"status": "success", "message": "Data saved successfully"}

# ---------------------------------------------------------------------------- #


# ---------------------------------------------------------------------------- #
#!                            เก็บข้อมูลการเเจ้งปัญหา                               #
# ---------------------------------------------------------------------------- #
def user_report(user_id , report_message):
    connection = connect_db()
    try:
        with connection.cursor() as cursor:
            cursor.execute(f"""
                INSERT INTO user_report (user_id, report_message)
                VALUES (%s, %s);
            """, (user_id, report_message))
            connection.commit()
            close_db(connection)
            return {"status": "success", "message": "Data saved successfully"}
    except Exception as e:
        print(f"Error: {e}")
        return {"status": "error", "message": f"An unexpected error occurred: {e}"}
    
# ---------------------------------------------------------------------------- #


# ---------------------------------------------------------------------------- #
#!         เก็บข้อมูลเมื่อ ai ไม่สามารถทำนายได้โดยให้ผู้ใช้กรอกข้อมูลให้                    #
# ---------------------------------------------------------------------------- #
def user_giveNew_data(user_id , new_data):

    connection = connect_db()
    image_path = new_data["image_path"]
    food_name = new_data["food_name"]
    if (image_path == None or food_name == None): return {"status": "error", "message": "Missing data"}
    
    try:
        with connection.cursor() as cursor:
            cursor.execute(f"""
                INSERT INTO user_new_data (user_id, image_path, food_name)
                VALUES (%s, %s, %s);
            """, (user_id, os.path.basename(image_path), food_name))
            connection.commit()
            close_db(connection)
            return {"status": "success", "message": "Data saved successfully"}
    except Exception as e:
        print(f"Error: {e}")
        return {"status": "error", "message": f"An unexpected error occurred: {e}"}

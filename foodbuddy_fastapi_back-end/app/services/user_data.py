from app.utils.db_utils import connect_db
import requests


# def save_eat_history(data):
#     connection = connect_db()
#     cursor = connection.cursor()
#     try:
#         # cursor.execute(
#         #     "INSERT INTO user_eat_history (calories, protein, carbohydrates, fat, food_name, user_lineId, category) VALUES (%s, %s, %s, %s, %s, %s, %s)",
#         #     (data["calories"], data["protein"], data["carbs"], data["fat"], data["food_name"], data["user_id"], data["food_type"])
#         # )
#         # connection.commit()
        
#         # if cursor.rowcount > 0:  # ตรวจสอบว่ามี row ถูก insert ไหม
#         #     return {"message": "Save eat history successfully", "status": "success"}
#         # else:
#         #     return {"message": "Failed to save eat history", "status": "error"}
#         calories, protein, carbohydrates, fat, food_name, user_lineId, category = data
        
#         if (calories == None or protein == None or carbohydrates == None or fat == None or food_name == None or user_lineId == None or category == None):
#             return {"error": "Failed to save eat history", "details": "Missing data"}
        
#         if not (isinstance(calories, (int, float)) and isinstance(protein, (int, float)) 
#                 and isinstance(carbohydrates, (int, float)) and isinstance(fat, (int, float))):
#             return {"error": "Failed to save eat history", "details": "Calories, protein, carbs, or fat must be numbers"}
#         try:
#             data = {
#                 "calories": int(calories),
#                 "protein": int(protein),
#                 "carbohydrates": int(carbohydrates),
#                 "fat": int(fat),
#                 "food_name": str(food_name),
#                 "user_lineId": str(user_lineId),
#                 "category": str(category)
#             }
#             data = requests.post("https://web-foodbuddy.vercel.app/api", json=data)
#             response = data.json()
#             if (response.get("message") == "success"):
#                 return {"message": "Save eat history successfully", "status": "success"}
#             else:
#                 return {"error": "Failed to save eat history", "details": "Failed to save data"}
                
#         except Exception as e:
#             print("Error:", str(e))
#             return {"error": "Failed to save eat history", "details": str(e)}


    
#     except Exception as e:
#         print("Error:", str(e))
#         return {"error": "Failed to save eat history", "details": str(e)}
    
#     finally:
#         cursor.close()
#         connection.close()

def save_eat_history(data):
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
        response = requests.post("https://web-foodbuddy.vercel.app/api", json=payload)
        
        # ตรวจสอบคำตอบจาก API
        
        response_json = response.json()
        if response_json.get("message") == "success":
            return {"message": "Save eat history successfully", "status": "success"}
        else:
            return {"error": "Failed to save eat history", "details": "Failed to save data"}
      

    except Exception as e:
        print("Error:", str(e))
        return {"error": "Failed to save eat history", "details": str(e)}
    
    

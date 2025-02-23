import sys
import os
from fastapi import FastAPI, UploadFile,Request,Header,  File, HTTPException, Query, logger
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from linebot.v3.exceptions import InvalidSignatureError
from fastapi.middleware.cors import CORSMiddleware
import json



from dotenv import load_dotenv


# เพิ่มโฟลเดอร์ app เข้าไปใน sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# นำเข้าโมดูลจากโฟลเดอร์ app
from app.handlers.line_handler import handler
from app.services.image_service import predict_image
from app.utils.db_utils import connect_db, close_db
from app.services.find_food import get_food_data
from app.models.line_models import FoodRequest

import os
import shutil





def remove_pycache(directory="."):
    for root, dirs, files in os.walk(directory):
        if "__pycache__" in dirs:
            pycache_path = os.path.join(root, "__pycache__")
            shutil.rmtree(pycache_path)
            print(f"Removed: {pycache_path}")



load_dotenv()
# remove_pycache()

app = FastAPI()
app.mount("/images", StaticFiles(directory="images"), name="images")


# !----------------------------ORIGIN-------------------------------------- #

# origins = [
#     "http://localhost:3000",
#     "htpp://localhost:8000"
# ]

# # Add CORSMiddleware to the app
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,  # allows requests from these origins
#     allow_credentials=True,
#     allow_methods=["*"],  # allows all HTTP methods (GET, POST, etc.)
#     allow_headers=["*"],  # allows all headers
# )


@app.post("/api/predict")
async def upload_image(image: UploadFile = File(...)):
    """
    สำหรับรับไฟล์รูปภาพและทำนายผลลัพธ์
    """
    try:
        # สร้างไฟล์ชั่วคราวและบันทึกไฟล์
        file_location = f"images/{image.filename}"

        with open(file_location, "wb") as file:
            image = file.write(await image.read())
            if (image):
                predict_result = predict_image(file_location)
                # print(predict_result)
                if (predict_result):
                    file.close() # ปิดไฟล์
                    print(file_location)
                    os.remove(file_location) # ลบไฟล์
                    return {"message": "Upload successful", "result": predict_result}
            else:
                return JSONResponse(status_code=400, content={"message": "Upload failed"})  
    
            
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Upload failed: {str(e)}"})

# ----- dialogflow webhook --------------------------------
# @app.post("/webhook")
# async def webhook(request: Request):
#     # body = await request.body()
#     data = await request.body()
#     # print(json.loads(data))
#     data = json.loads(data)

#     print(data["queryResult"]["queryText"])

#     print(data["originalDetectIntentRequest"])
        
#     return {"message": "Hello"} 

# ----- line webhook --------------------------------
@app.post("/api/callback")
async def callback(request: Request, x_line_signature: str = Header(None)):
    """
    สำหรับรับข้อมูลจาก LINE
    """
    body = await request.body()
    body_str = body.decode('utf-8')
    try:
        handler.handle(body_str, x_line_signature)
    except InvalidSignatureError:
        print("Invalid signature. Please check your channel access token/channel secret.")
        raise HTTPException(status_code=400, detail="Invalid signature.")

    return 'OK'

# --------------------------------------------------------

@app.get("/health")
def health():
    """
    สำหรับตรวจสอบสถานะของระบบ
    """
    connection = connect_db()
    if connection:
        try:
            return {"status": "ok", "message": "Connection successful"}
        finally:
            close_db(connection)
    else:
        return {"status": "error", "message": "Connection failed"}


@app.post("/search_by_name")
async def search_food(request: FoodRequest):
    """
    ค้นหาข้อมูลอาหารตามชื่อจาก ThaiFCD และดึง food_id จากไฟล์ JSON
    """
    name = request.name  # รับชื่ออาหารจาก request body

    # โหลดข้อมูล JSON ที่เก็บข้อมูลอาหาร
    with open('food_data.json', 'r', encoding='utf-8') as file:
        load_json = json.load(file)

    # ตัวแปรเก็บข้อมูลอาหาร
    data = []

    # ทำการค้นหาข้อมูลอาหารจาก JSON
    for food in load_json:
        keyword_thai = food.get('Thai_name')
        keyword_thai_3 = keyword_thai.split(',')

        # วนลูปเช็คแต่ละคำในชื่ออาหาร
        for keyword in keyword_thai_3:
            if keyword.strip() == name.strip():  # เพิ่มการใช้ strip() เพื่อหลีกเลี่ยงปัญหาจากช่องว่าง
                food_item = {
                    'thai_name': food.get('Thai_name'),
                    'eng_name': food.get('English_name'),
                    'nutrition': food.get('nutrition')
                }
                data.append(food_item)
                break  # ถ้าค้นพบแล้วหยุดค้นหาต่อในคำอื่นๆ

    # ตรวจสอบว่ามีข้อมูลหรือไม่
    if data:
        return {"message": "ค้นหาข้อมูลสำเร็จ", "data": data}
    else:
        return {"message": "ไม่พบข้อมูลสำหรับชื่ออาหารนี้"}



# @""" app.post("/search_food")
# def search_from_database(request: FoodRequest):
#     """
#         ค้นหาข้อมูลอาหารตามชื่อจาก ThaiFCD 
#     """
#     name = request.name  # รับชื่ออาหารจาก request body

#     data = get_food_data(name)
#     return {"data": data, "param" : name} """
    


   
# @app.post("/find_food_db")
# def find_food_db(request: FoodRequest):
#     """
#     ค้นหาข้อมูลอาหารจากฐานข้อมูล TABLE food_menu
#     """
#     name = request.name # รับชื่ออาหารจาก request body
#     if (not name):
#         return {"status": "error", "message": "Missing parameter"}
#     connection = connect_db()
#     if connection:
#         data = []
#         try:
#             with connection.cursor() as cursor:
#                 cursor.execute(f"SELECT * FROM food_menu WHERE thai_name LIKE '%{name}%' OR eng_name LIKE '%{name}%' ")
#                 result = cursor.fetchall()
#                 for row in result:
#                     data.append({
#                         "id": str(row[0]),
#                         "thai_name": row[1],
#                         "eng_name": row[2],
#                         "nutrition": {
#                             "calories" : row[4],
#                             "protein" : row[5],
#                             "carbohydrate" : row[6],
#                             "fat" : row[7],
#                         }
#                     })
#                 return {"status": "ok", "message": "Find Successfully", "result": data}
#         except Exception as e:
#             return {"status": "error", "message": f"An unexpected error occurred: {e}"}
#         finally:
#             close_db(connection)
#     else:
#         return {"status": "error", "message": "Connection failed"}



# About front-end part 



# ------------------------------- USER ZONE ------------------------------------- #


@app.post("/save_eat_history")
async def save_eat_history(request: Request):
    """
        บันทึกประวัติการทานอาหาร\n
        calories: แคลอรี่\n
        protein: โปรตีน\n
        carbs: คาร์โบไฮเดรต\n
        fat: ไขมัน\n
        food_name: ชื่ออาหาร\n
        user_id: ไลน์ไอดี
        food_type : ประเภทอาหาร
    """
    data = await request.json()
    print(data)
    print(data["calories"])
    print(data["protein"])
    print(data["carbs"])
    print(data["fat"])
    print(data["food_name"])
    print(data["user_id"])
    print(data["food_type"])

    return {"message": "Save eat history successfully"}






if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

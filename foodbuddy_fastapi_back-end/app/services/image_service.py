from ultralytics import YOLO
from app.utils.db_utils import connect_db


names = {
    'BeefSteak': 'สเต็กเนื้อ',
    'BeefStew': 'สตูว์เนื้อ',
    'Bibimbap': 'บิบิมบับ',
    'Burger': 'เบอร์เกอร์',
    'Calamari': 'ปลาหมึกทอด',
    'CarbonaraPasta': 'คาร์โบนาราพาสต้า',
    'ClearSoupwithTofuandMincedPork': 'ต้มจืดเต้าหู้หมูสับ',
    'CongeewithCenturyEggandPork': 'ข้าวต้มไข่เยี่ยวม้าและหมู',
    'CrabOmelette': 'ไข่เจียวปู',
    'DimSum': 'ติ่มซำ',
    'FishandChips': 'ปลาและมันฝรั่งทอด',
    'GaengSomCha-OmKai': 'แกงส้มชะอมไข่',
    'GreenCurryChicken': 'แกงเขียวหวานไก่',
    'GrilledChickenwithStickyRice': 'ไก่ย่างข้าวเหนียว',
    'GrilledPorkSkewers': 'หมูปิ้ง',
    'HainaneseChickenRice': 'ข้าวมันไก่'
}

def predict_image(image_path: str):


  



    print("[debug] Detecting.. call function")
    result_to_client = []
    model = YOLO("best.pt")
    result = model(image_path)
    predicted_names = [model.names[int(box.cls)] for box in result[0].boxes]
    predicted_confidences = [box.conf for box in result[0].boxes]

    if (len(predicted_names) == 0):
        result_to_client.append(
            {
                "name": "ไม่สามารถระบุได้",
                "confidence": 0.0,
                "predict": "ไม่สามารถระบุได้"
            }
        )
        return result_to_client
    confidence = round(predicted_confidences[0].item(), 2)
    # print("[debug] Result : ", predicted_names) 
    # print("[debug] Confidence : ", confidence)  
    
    
    for name in predicted_names:
        if (confidence <= 0.5): 
            result_to_client.append(
                {
                    "name": "ไม่สามารถระบุได้",
                    "confidence": confidence,
                    "predict": "ไม่สามารถระบุได้"
                }
            ) 
            return result_to_client

        for k, v in names.items():
            if (name == k):
                connection = connect_db()
                try:
                    with connection.cursor() as cursor:
                        cursor.execute(f"""
                                       SELECT *
FROM food_nutration AS fn
JOIN food_category AS cat ON fn.category_name = cat.id
WHERE fn.eng_name LIKE '%{k}%';
""")
                        result = cursor.fetchall()
                        for row in result:
                            result_to_client.append(
                                {
                                    "name": v,
                                    "confidence": confidence,
                                    "nutration": row[5],
                                    "origin" : row[3],
                                    "food_type" : row[7],
                                }
                            )
                        return result_to_client
                except Exception as e:
                    print(f"Error KUB: {e}")
                    return None
        


    return result_to_client
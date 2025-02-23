# from linebot.v3.messaging import FlexMessage, FlexContainer
# import json

# def create_flex_bubble(image_url, predict_result):
#     print(predict_result)
#     percent = round(predict_result[0]['confidence'] * 100, 2)
#     # if (predict_result)
#     ingredient_json = predict_result[0]['nutration']
#     ingredient_data = json.loads(ingredient_json)  

#     calories = ingredient_data['calories']
#     protein = ingredient_data['protein']
#     carbohydrates = ingredient_data['carbs']
#     fat = ingredient_data['fat']

#     # print(calories, protein, carbohydrates, fat)
#     # print("predict_result = ",predict_result[0]['nutration'])
#     bubble_string = f"""
#                         {{
#                     "type": "bubble",
#                     "body": {{
#                         "type": "box",
#                         "layout": "vertical",
#                         "contents": [
#                             {{
#                                 "type": "text",
#                                 "text": "Foodbuddy",
#                                 "weight": "bold",
#                                 "color": "#1DB446",
#                                 "size": "sm"
#                             }},
#                             {{
#                                 "type": "text",
#                                 "text": "{predict_result[0]['name']}",
#                                 "weight": "bold",
#                                 "size": "xxl",
#                                 "margin": "md"
#                             }},
#                             {{
#                                 "type": "text",
#                                 "text": "เเคลอรี่ {calories} กิโลแคลอรี่",
#                                 "weight": "bold",
#                                 "color": "#1DB446",
#                                 "size": "xl"
#                             }},
#                             {{
#                                 "type": "text",
#                                 "text": "ความมั่นใจ: {percent} %",
#                                 "size": "xs",
#                                 "color": "#aaaaaa",
#                                 "wrap": true
#                             }},
                           
#                             {{
#                                 "type": "separator",
#                                 "margin": "xxl"
#                             }},
#                             {{
#                                 "type": "box",
#                                 "layout": "vertical",
#                                 "margin": "xxl",
#                                 "spacing": "sm",
#                                 "contents": [
#                                 {{
#                                     "type": "box",
#                                     "layout": "horizontal",
#                                     "contents": [
#                                     {{
#                                         "type": "text",
#                                         "text": "หมู",
#                                         "size": "sm",
#                                         "color": "#555555",
#                                         "flex": 0
#                                     }},
#                                     {{
#                                         "type": "text",
#                                         "text": "300 cal",
#                                         "size": "sm",
#                                         "color": "#111111",
#                                         "align": "end"
#                                     }}
#                                     ]
#                                 }},
#                                 {{
#                                     "type": "box",
#                                     "layout": "horizontal",
#                                     "contents": [
#                                     {{
#                                         "type": "text",
#                                         "text": "หมู",
#                                         "size": "sm",
#                                         "color": "#555555",
#                                         "flex": 0
#                                     }},
#                                     {{
#                                         "type": "text",
#                                         "text": "300 cal",
#                                         "size": "sm",
#                                         "color": "#111111",
#                                         "align": "end"
#                                     }}
#                                     ]
#                                 }},
#                                 {{
#                                     "type": "box",
#                                     "layout": "horizontal",
#                                     "contents": [
#                                     {{
#                                         "type": "text",
#                                         "text": "หมู",
#                                         "size": "sm",
#                                         "color": "#555555",
#                                         "flex": 0
#                                     }},
#                                     {{
#                                         "type": "text",
#                                         "text": "300 cal",
#                                         "size": "sm",
#                                         "color": "#111111",
#                                         "align": "end"
#                                     }}
#                                     ]
#                                 }},
#                                 {{
#                                     "type": "separator",
#                                     "margin": "xxl"
#                                 }},
#                                 {{
#                                     "type": "box",
#                                     "layout": "horizontal",
#                                     "margin": "xxl",
#                                     "contents": [
#                                     {{
#                                         "type": "text",
#                                         "text": "แคลอรี่",
#                                         "size": "sm",
#                                         "color": "#555555"
#                                     }},
#                                     {{
#                                         "type": "text",
#                                         "text": "{calories} กิโลเเคลอรี่",
#                                         "size": "sm",
#                                         "color": "#111111",
#                                         "align": "end"
#                                     }}
#                                     ]
#                                 }},
#                                 {{
#                                     "type": "box",
#                                     "layout": "horizontal",
#                                     "contents": [
#                                     {{
#                                         "type": "text",
#                                         "text": "คาร์โบไฮเดรต",
#                                         "size": "sm",
#                                         "color": "#555555"
#                                     }},
#                                     {{
#                                         "type": "text",
#                                         "text": "{carbohydrates} กรัม",
#                                         "size": "sm",
#                                         "color": "#111111",
#                                         "align": "end"
#                                     }}
#                                     ]
#                                 }},
#                                 {{
#                                     "type": "box",
#                                     "layout": "horizontal",
#                                     "contents": [
#                                     {{
#                                         "type": "text",
#                                         "text": "ไขมัน",
#                                         "size": "sm",
#                                         "color": "#555555"
#                                     }},
#                                     {{
#                                         "type": "text",
#                                         "text": "{fat} กรัม",
#                                         "size": "sm",
#                                         "color": "#111111",
#                                         "align": "end"
#                                     }}
#                                     ]
#                                 }},
#                                 {{
#                                     "type": "box",
#                                     "layout": "horizontal",
#                                     "contents": [
#                                     {{
#                                         "type": "text",
#                                         "text": "โปรตีน",
#                                         "size": "sm",
#                                         "color": "#555555"
#                                     }},
#                                     {{
#                                         "type": "text",
#                                         "text": "{protein} กรัม",
#                                         "size": "sm",
#                                         "color": "#111111",
#                                         "align": "end"
#                                     }}
#                                     ]
#                                 }},
#                                 {{
#                                     "type": "box",
#                                     "layout": "horizontal",
#                                     "contents": [
#                                     {{
#                                         "type": "text",
#                                         "text": "เเละอื่นๆ",
#                                         "size": "sm",
#                                         "color": "#555555"
#                                     }}
#                                     ]
#                                 }}
#                                 ]
#                             }}
#                         ]
#                     }},
                    
#                     "footer": {{
#                         "type": "box",
#                         "layout": "vertical",
#                         "contents": [
#                         {{
#                             "type": "button",
#                             "action": {{
#                                 "type": "message",
#                                 "label": "บันทึก",
#                                 "text": "บันทึก"
#                             }},
#                             "margin": "xs",
#                             "height": "sm",
#                             "style": "primary"
#                         }},
#                         {{
#                             "type": "button",
#                             "action": {{
#                                 "type": "message",
#                                 "label": "เเก้ไขเมนู",
#                                 "text": "เเก้ไขเมนู"
#                             }},
#                             "margin": "xs",
#                             "height": "sm",
#                             "style": "link"
                           
#                         }}
#                         ],
#                         "position": "relative"
#                     }},
#                     "styles": {{
#                         "footer": {{
#                         "separator": true
#                         }}
#                     }}
#                     }}
#     """
#     message = FlexMessage(alt_text="โภชนาการของคุณ", contents=FlexContainer.from_json(bubble_string))
#     return message

from linebot.v3.messaging import FlexMessage, FlexContainer
import json

# ฟังก์ชันสำหรับสร้าง header
def create_header(predict_result):
    percent = round(predict_result[0]['confidence'] * 100, 2)
    name = predict_result[0]['name']
    calories = json.loads(predict_result[0]['nutration'])['calories']
    return [
        {"type": "text", "text": "Foodbuddy", "weight": "bold", "color": "#1DB446", "size": "sm"},
        {"type": "text", "text": name, "weight": "bold", "size": "xxl", "margin": "md"},
        {"type": "text", "text": f"แคลอรี่ {calories} กิโลแคลอรี่", "weight": "bold", "color": "#1DB446", "size": "xl"},
        {"type": "text", "text": f"ความมั่นใจ: {percent} %", "size": "xs", "color": "#aaaaaa", "wrap": True},
        {"type": "separator", "margin": "xxl"}
    ]

# ฟังก์ชันสำหรับสร้าง nutrition box ด้วย loop
def create_nutrition_box(nutrition_data):
    # รายการโภชนาการที่ต้องการแสดง
    nutrition_items = [
        {"label": "แคลอรี่", "value": f"{nutrition_data['calories']} กิโลแคลอรี่"},
        {"label": "คาร์โบไฮเดรต", "value": f"{nutrition_data['carbs']} กรัม"},
        {"label": "ไขมัน", "value": f"{nutrition_data['fat']} กรัม"},
        {"label": "โปรตีน", "value": f"{nutrition_data['protein']} กรัม"}
    ]
    
    # ใช้ loop สร้าง contents
    contents = [
        {
            "type": "box",
            "layout": "horizontal",
            "contents": [
                {"type": "text", "text": item["label"], "size": "sm", "color": "#555555"},
                {"type": "text", "text": item["value"], "size": "sm", "color": "#111111", "align": "end"}
            ]
        } for item in nutrition_items
    ]
    
    return {
        "type": "box",
        "layout": "vertical",
        "margin": "xxl",
        "spacing": "sm",
        "contents": contents
    }

# ฟังก์ชันสำหรับสร้าง ingredient box ด้วย loop (สมมติว่ามีข้อมูลวัตถุดิบ)
def create_ingredient_box(nutrition_data):
    # สมมติว่า nutrition_data มี field 'ingredients' เป็น list ของวัตถุดิบ
    ingredients = nutrition_data.get('ingredients', [
        {"name": "หมู", "calories": 300},
        {"name": "ข้าว", "calories": 200},
        {"name": "น้ำมัน", "calories": 100}
    ])
    
    # ใช้ loop จำกัดแค่ 3 รายการแรก
    contents = [
        {
            "type": "box",
            "layout": "horizontal",
            "contents": [
                {"type": "text", "text": ing["name"], "size": "sm", "color": "#555555"},
                {"type": "text", "text": f"{ing['calories']} cal", "size": "sm", "color": "#111111", "align": "end"}
            ]
        } for ing in ingredients[:3]
    ]
    
    # ถ้ามีมากกว่า 3 รายการ เพิ่ม "และอื่นๆ"
    if len(ingredients) > 3:
        contents.append({"type": "text", "text": "และอื่นๆ...", "size": "sm", "color": "#555555"})
    
    return {
        "type": "box",
        "layout": "vertical",
        "margin": "xxl",
        "spacing": "sm",
        "contents": [{"type": "text", "text": "วัตถุดิบ", "weight": "bold", "size": "md"}] + contents
    }

# ฟังก์ชันสำหรับสร้าง footer
def create_footer():
    return {
        "type": "box",
        "layout": "vertical",
        "contents": [
            {"type": "button", "action": {"type": "message", "label": "บันทึก", "text": "บันทึก"}, "style": "primary"},
            {"type": "button", "action": {"type": "message", "label": "แก้ไขเมนู", "text": "แก้ไขเมนู"}, "margin": "xs", "style": "link"}
        ]
    }

# ฟังก์ชันหลัก
def create_flex_bubble(image_url, predict_result):
    ingredient_json = predict_result[0]['nutration']
    ingredient_data = json.loads(ingredient_json)

    flex_contents = {
        "type": "bubble",
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": (
                create_header(predict_result) +
                [create_nutrition_box(ingredient_data)] +
                [create_ingredient_box(ingredient_data)]
            )
        },
        "footer": create_footer(),
        "styles": {"footer": {"separator": True}}
    }

    message = FlexMessage(alt_text="โภชนาการของคุณ", contents=FlexContainer.from_dict(flex_contents))
    return message


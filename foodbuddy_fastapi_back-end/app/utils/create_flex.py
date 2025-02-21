from linebot.v3.messaging import FlexMessage, FlexContainer
import json

def create_flex_bubble(image_url, predict_result):
    print(predict_result)
    percent = round(predict_result[0]['confidence'] * 100, 2)
    # if (predict_result)
    ingredient_json = predict_result[0]['nutration']
    ingredient_data = json.loads(ingredient_json)  

    calories = ingredient_data['calories']
    protein = ingredient_data['protein']
    carbohydrates = ingredient_data['carbs']
    fat = ingredient_data['fat']

    # print(calories, protein, carbohydrates, fat)
    # print("predict_result = ",predict_result[0]['nutration'])
    bubble_string = f"""
                        {{
                    "type": "bubble",
                    "body": {{
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {{
                                "type": "text",
                                "text": "Foodbuddy",
                                "weight": "bold",
                                "color": "#1DB446",
                                "size": "sm"
                            }},
                            {{
                                "type": "text",
                                "text": "{predict_result[0]['name']}",
                                "weight": "bold",
                                "size": "xxl",
                                "margin": "md"
                            }},
                            {{
                                "type": "text",
                                "text": "เเคลอรี่ {calories} กิโลแคลอรี่",
                                "weight": "bold",
                                "color": "#1DB446",
                                "size": "xl"
                            }},
                            {{
                                "type": "text",
                                "text": "ความมั่นใจ: {percent} %",
                                "size": "xs",
                                "color": "#aaaaaa",
                                "wrap": true
                            }},
                           
                            {{
                                "type": "separator",
                                "margin": "xxl"
                            }},
                            {{
                                "type": "box",
                                "layout": "vertical",
                                "margin": "xxl",
                                "spacing": "sm",
                                "contents": [
                                {{
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                    {{
                                        "type": "text",
                                        "text": "หมู",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    }},
                                    {{
                                        "type": "text",
                                        "text": "300 cal",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }}
                                    ]
                                }},
                                {{
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                    {{
                                        "type": "text",
                                        "text": "หมู",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    }},
                                    {{
                                        "type": "text",
                                        "text": "300 cal",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }}
                                    ]
                                }},
                                {{
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                    {{
                                        "type": "text",
                                        "text": "หมู",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    }},
                                    {{
                                        "type": "text",
                                        "text": "300 cal",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }}
                                    ]
                                }},
                                {{
                                    "type": "separator",
                                    "margin": "xxl"
                                }},
                                {{
                                    "type": "box",
                                    "layout": "horizontal",
                                    "margin": "xxl",
                                    "contents": [
                                    {{
                                        "type": "text",
                                        "text": "แคลอรี่",
                                        "size": "sm",
                                        "color": "#555555"
                                    }},
                                    {{
                                        "type": "text",
                                        "text": "{calories} กิโลเเคลอรี่",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }}
                                    ]
                                }},
                                {{
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                    {{
                                        "type": "text",
                                        "text": "คาร์โบไฮเดรต",
                                        "size": "sm",
                                        "color": "#555555"
                                    }},
                                    {{
                                        "type": "text",
                                        "text": "{carbohydrates} กรัม",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }}
                                    ]
                                }},
                                {{
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                    {{
                                        "type": "text",
                                        "text": "ไขมัน",
                                        "size": "sm",
                                        "color": "#555555"
                                    }},
                                    {{
                                        "type": "text",
                                        "text": "{fat} กรัม",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }}
                                    ]
                                }},
                                {{
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                    {{
                                        "type": "text",
                                        "text": "โปรตีน",
                                        "size": "sm",
                                        "color": "#555555"
                                    }},
                                    {{
                                        "type": "text",
                                        "text": "{protein} กรัม",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }}
                                    ]
                                }},
                                {{
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                    {{
                                        "type": "text",
                                        "text": "เเละอื่นๆ",
                                        "size": "sm",
                                        "color": "#555555"
                                    }}
                                    ]
                                }}
                                ]
                            }}
                        ]
                    }},
                    
                    "footer": {{
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                        {{
                            "type": "button",
                            "action": {{
                                "type": "message",
                                "label": "บันทึก",
                                "text": "บันทึก"
                            }},
                            "margin": "xs",
                            "height": "sm",
                            "style": "primary"
                        }},
                        {{
                            "type": "button",
                            "action": {{
                                "type": "message",
                                "label": "เเก้ไขเมนู",
                                "text": "เเก้ไขเมนู"
                            }},
                            "margin": "xs",
                            "height": "sm",
                            "style": "link"
                           
                        }}
                        ],
                        "position": "relative"
                    }},
                    "styles": {{
                        "footer": {{
                        "separator": true
                        }}
                    }}
                    }}
    """
    message = FlexMessage(alt_text="โภชนาการของคุณ", contents=FlexContainer.from_json(bubble_string))
    return message
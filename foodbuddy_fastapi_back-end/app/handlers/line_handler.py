from linebot.v3 import WebhookHandler
from linebot.v3.messaging import (
    ApiClient, Configuration, MessagingApi, MessagingApiBlob, ReplyMessageRequest, TextMessage,
    QuickReply, QuickReplyItem, MessageAction, CameraAction, URIAction
)
from linebot.v3.messaging import FlexMessage, FlexContainer
from linebot.v3.webhooks import MessageEvent, TextMessageContent, ImageMessageContent, FollowEvent
from linebot.v3.messaging.models.show_loading_animation_request import ShowLoadingAnimationRequest

import os
import json
from dotenv import load_dotenv

# Import ฟังก์ชันช่วยเหลือ
from services.image_service import predict_image
from services.user_data import incorrect_predict, save_eat_history, user_giveNew_data, user_report
from utils.create_flex import create_flex_bubble, goto_history, goto_settingTarget
from utils.file_utils import save_image, remove_image

# โหลดค่า ENV
load_dotenv()

# ตั้งค่าการเชื่อมต่อ
get_access_token = os.getenv('LINE_CHANNEL_ACCESS_TOKEN')
handler = WebhookHandler(os.getenv('LINE_CHANNEL_SECRET'))
configuration = Configuration(access_token=get_access_token)

# เก็บข้อมูลผู้ใช้ชั่วคราว
user_corrections = {}


def initialize_user_data(user_id):
    """ ตั้งค่าข้อมูลเริ่มต้นของผู้ใช้ """
    user_corrections.setdefault(user_id, {
        "status": None, "image_receive": False, "image_path": None,
        "nutrition": None, "food_name": None, "food_type": None, 
        "report": False, "report_message": None
    })
    return user_corrections[user_id]


def send_reply(line_bot_api, reply_token, text, quick_reply=None):
    """ ส่งข้อความตอบกลับไปยังผู้ใช้ """
    message = TextMessage(text=text, quick_reply=quick_reply) if quick_reply else TextMessage(text=text)
    line_bot_api.reply_message(ReplyMessageRequest(replyToken=reply_token, messages=[message]))


def create_quick_reply():
    """ สร้าง Quick Reply เมนูให้ผู้ใช้เลือก """
    return QuickReply(items=[
        QuickReplyItem(action=CameraAction(label="ถ่ายรูปอาหาร")),
        QuickReplyItem(action=URIAction(label="ดูประวัติการกิน", uri="https://web-foodbuddy.vercel.app/")),
        QuickReplyItem(action=URIAction(label="ตั้งเป้าหมายสุขภาพ", uri="https://web-foodbuddy.vercel.app/"))
    ])


def start_loading_animation(user_id):
    """ แสดงแอนิเมชันโหลดให้ผู้ใช้เห็น """
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        line_bot_api.show_loading_animation(ShowLoadingAnimationRequest(chat_id=user_id, loadingSeconds=10))

# def goto_settingTarget():
#     return URIAction(label="ตั้งเป้าหมายสุขภาพ", uri="https://web-foodbuddy.vercel.app/dashboard/setting")


@handler.add(MessageEvent, message=ImageMessageContent)
def handle_image(event: MessageEvent):
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        line_bot_blob_api = MessagingApiBlob(api_client)
        user_id = event.source.user_id
        user_data = initialize_user_data(user_id)
        start_loading_animation(user_id)
        file_name = save_image(event.message.id, line_bot_blob_api)
        if file_name:
            predict_result = predict_image(file_name)
            image_url = f"{os.getenv('API_URL')}/images/{event.message.id}.jpg"

            if predict_result[0]["name"] == "ไม่สามารถระบุได้":
                send_reply(line_bot_api, event.reply_token, "ขอโทษด้วย ฉันไม่สามารถเข้าใจรูปภาพอาหารได้ค่ะ ช่วยเเนะนำเมนูนี้หนูฉันหน่อยได้มั้ยคะ เช่น ไอติม | เช่น ข้าวต้ม โดยป้อนเเค่ชื่อเมนู")
                user_data.update({"status": "unknown", "image_receive": True, "image_path": file_name})
            else:
                nutrition_json = predict_result[0].get('nutration')
                if nutrition_json:
                    user_data.update({
                        "food_name": predict_result[0]['name'],
                        "food_type": predict_result[0]['food_type'],
                        "nutrition": json.loads(nutrition_json),
                        "image_receive": True,
                        "image_path": file_name
                    })
                    bubble = create_flex_bubble(image_url, predict_result)
                    line_bot_api.reply_message(ReplyMessageRequest(replyToken=event.reply_token, messages=[bubble]))
                else:
                    send_reply(line_bot_api, event.reply_token, f"ไม่มีข้อมูลโภชนาการสำหรับ {predict_result[0]['name']}")
                    user_data.update({"status": "wrong", "image_receive": True, "image_path": file_name})


@handler.add(MessageEvent, message=TextMessageContent)
def handle_message(event: MessageEvent):
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        user_id = event.source.user_id
        user_data = initialize_user_data(user_id)
        message_text = event.message.text

        start_loading_animation(user_id)

        print(user_data)

        if message_text in ["เเก้ไขเมนู", "แก้ไขเมนู"]:
            reply_text = "โปรดป้อนชื่อเมนูที่ถูกต้องค่ะ!" if user_data["image_receive"] else "โปรดส่งรูปอาหารก่อนค่ะ!"
            user_data["status"] = "edit" if user_data["image_receive"] else None
        elif message_text in ["วิธีใช้งาน", "วิธีใช้"]:
            reply_text = """🔹 การใช้งาน LINE Chat Bot
✅ 1. วิธีใช้งานเบื้องต้น
    🔹 ส่งรูปภาพอาหาร → ระบบจะวิเคราะห์และคำนวณแคลอรี่
    🔹 รับผลลัพธ์กลับจากบอท → แจ้งข้อมูลโภชนาการ
    🔹 กดปุ่ม "บันทึกข้อมูล" → บันทึกข้อมูลลงฐานข้อมูล
    🔹 เข้าเว็บไซต์ → ดูประวัติการกิน สถิติแคลอรี่ และการวิเคราะห์สารอาหาร
✅ 2.หน้าเว็บแสดงผล (Dashboard)
    🔹 กราฟแสดงปริมาณสารอาหารที่ได้รับ → เปรียบเทียบกับเป้าหมาย
    🔹 ตารางแสดงอาหารที่กินแต่ละวัน
    🔹 แจ้งเตือนหากกินเกิน หรือขาดสารอาหาร
    🔹 รองรับการเชื่อมต่อกับ LINE เพื่อดึงข้อมูลแบบ Real-time
            """
        elif message_text in ["เเจ้งปัญหา", "แจ้งปัญหา"]:
            reply_text = "โปรดระบุปัญหาที่พบให้หน่อยค่ะ!"
            user_data["report"] = True
            user_data["report_message"] = None
        elif message_text in ["ดูประวัติการกิน", "ดูประวัติ"]:
           
            reply_text = "วิธีการดูประวัติการกินของคุณค่ะ!"

            flex_contents = goto_history()
            flex_message = FlexMessage(alt_text="ดูประวัติการกินของคุณ", contents=FlexContainer.from_dict(flex_contents))

            line_bot_api.reply_message(
                ReplyMessageRequest(
                    replyToken=event.reply_token,
                    messages=[flex_message]
                )
            )
            return

        elif message_text in ["ตั้งเป้าหมาย", "เป้าหมาย", "ตั้งเป้าหมายสุขภาพ"]:
           
            
            reply_text = "วิธีการตั้งเป้าหมายสุขภาพของคุณ"

            flex_contents = goto_settingTarget()
            flex_message = FlexMessage(alt_text="ดูตั้งเป้าหมายของคุณ", contents=FlexContainer.from_dict(flex_contents))

            line_bot_api.reply_message(
                ReplyMessageRequest(
                    replyToken=event.reply_token,
                    messages=[flex_message]
                )
            )
            return

        elif message_text == "บันทึก":
            if user_data["image_receive"]:
                
                save_result = save_eat_history({
                    "user_lineId": user_id,
                    "calories": user_data["nutrition"].get("calories"),
                    "carbs": user_data["nutrition"].get("carbs"),
                    "fat": user_data["nutrition"].get("fat"),
                    "protein": user_data["nutrition"].get("protein"),
                    "food_name": user_data["food_name"],
                    "food_type": user_data["food_type"]
                })
                if save_result.get("status") == "success":
                    remove_image(user_data["image_path"])
                    send_reply(line_bot_api, event.reply_token, "บันทึกเรียบร้อย!", create_quick_reply())
                    user_corrections.pop(user_id, None)  # ล้างข้อมูลผู้ใช้
                return
            else:
                reply_text = "โปรดส่งรูปอาหารก่อนค่ะ!"
        elif user_data["status"] == "unknown":
            # print("this is input :", message_text)
            reply_text = "ขอบคุณสำหรับข้อเสนอแนะค่ะ! ทางเราจะนำไปพัฒนาต่อไปค่ะ!"

            # ---------------------------------------------------------------------------- #
            #                                   API CHECK                                  #
            # ---------------------------------------------------------------------------- #
            data = {
                "food_name": message_text,
                "image_path": user_data["image_path"]
            }
            user_giveNew_data(user_id, data)

        elif user_data["report"] == True:  
            user_data["report_message"] = message_text
            reply_text = "ขอบคุณสำหรับข้อเสนอแนะค่ะ! ทางเราจะนำไปพัฒนาต่อไปค่ะ!"

            user_report(user_id, user_data["report_message"])
            # ---------------------------------------------------------------------------- #
            # !                       เพิ่มข้อมูลปัญหาไปที่ Database                             #
            # ---------------------------------------------------------------------------- #
            #               @param user_id : ไลน์ไอดี                                        #
            #               @param report_message : ข้อความที่รับมาจากผู้ใช้                      #
            # ---------------------------------------------------------------------------- #
            # ---------------------------------------------------------------------------- #

            
            user_data["report"] = False
            user_data["report_message"] = None
            

        elif user_data["status"] == "edit" and user_data["image_receive"]:
            incorrect_predict({
                "user_Id": user_id,
                "old_food_name": user_data["food_name"],
                "new_food_name": message_text,
                "food_type": user_data["food_type"],
                "nutrition": user_data["nutrition"],
                "image_path": user_data["image_path"]
            })
            send_reply(line_bot_api, event.reply_token, f"ปรับปรุงเมนูเป็น '{message_text}' เรียบร้อยค่ะ! 🙏")
            user_corrections.pop(user_id, None)  # ล้างข้อมูลผู้ใช้
            return

        else:
            reply_text = "ส่งรูปอาหารมาเลย! ฉันจะช่วยคุณคำนวณแคลอรี่ให้ค่ะ 🍱📊"

        send_reply(line_bot_api, event.reply_token, reply_text, create_quick_reply())


@handler.add(FollowEvent)
def handle_follow(event: FollowEvent):
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        send_reply(line_bot_api, event.reply_token, "สวัสดีค่า!", create_quick_reply())

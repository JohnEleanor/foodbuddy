from linebot.v3 import WebhookHandler
from linebot.v3.messaging import ApiClient, Configuration, MessagingApi, MessagingApiBlob, ReplyMessageRequest, TextMessage,  FlexBubble, FlexImage, FlexBox, FlexText, FlexIcon, FlexButton, URIAction,  QuickReply,QuickReplyItem, MessageAction, CameraAction
from linebot.v3.webhooks import MessageEvent, TextMessageContent, ImageMessageContent, FollowEvent
from linebot.v3.messaging.models.show_loading_animation_request import ShowLoadingAnimationRequest
from services.image_service import predict_image
from utils.create_flex import create_flex_bubble
from utils.file_utils import save_image, remove_image
import os
from dotenv import load_dotenv
import json

load_dotenv()


# -----
from services.user_data import save_eat_history

get_access_token = os.getenv('LINE_CHANNEL_ACCESS_TOKEN')
handler = WebhookHandler(os.getenv('LINE_CHANNEL_SECRET'))
configuration = Configuration(access_token=get_access_token)


user_corrections = {}



@handler.add(MessageEvent, message=ImageMessageContent)
def handle_image(event: ImageMessageContent):
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        line_bot_blob_api = MessagingApiBlob(api_client)
        line_bot_api.show_loading_animation(
            ShowLoadingAnimationRequest(
                chat_id=event.source.user_id,
                loadingSeconds=10
            )
        )
        user_id = event.source.user_id  # ดึง user_id มาเก็บไว้ใช้
        user_corrections.setdefault(user_id, {"status": None, "image_receive": False, "image_path": None, "nutrition" : None, "food_name" : None})  # ตั้งค่าพื้นฐานหากไม่มีข้อมูล
        user_data = user_corrections[user_id]  # ดึงข้อมูลของผู้ใช้
        
        
        file_name = save_image(event.message.id, line_bot_blob_api)
        if file_name:
            predict_result = predict_image(file_name)
            
            image_url = f"{os.getenv('API_URL')}/images/{event.message.id}.jpg"
            
 

            for item in predict_result:
                if (item["name"] == "ไม่สามารถระบุได้"):
                    line_bot_api.reply_message(
                    reply_message_request=ReplyMessageRequest(
                            replyToken=event.reply_token,
                            messages=[TextMessage(text="ขอโทษด้วย ฉันไม่สามารถเข้าใจรูปภาพอาหารได้ คะ")]
                        )
                    )
                else: 
                    nutrition_json = predict_result[0]['nutration']
                    if (nutrition_json): 
                        nutrition_data = json.loads(nutrition_json)  
                        # print(nutrition_data)
                        print(predict_result[0]['name'])
                        user_data["food_name"] = predict_result[0]['name']
                        user_data["food_type"] = predict_result[0]['food_type']
                        user_data["nutrition"] = nutrition_data
                        user_data["image_receive"] = True
                        bubble = create_flex_bubble(image_url, predict_result)
                        line_bot_api.reply_message(
                        reply_message_request=ReplyMessageRequest(
                                replyToken=event.reply_token,
                                messages=[
                                    bubble
                                    # TextMessage(quick_reply=save_image_quick_reply())
                                ]
                            )
                        )
                    else:
                        print("Nutrition data not found")
                   
                     
            remove_image(file_name)


@handler.add(MessageEvent, message=TextMessageContent)
def handle_message(event: MessageEvent):
    try:
        with ApiClient(configuration) as api_client:
            line_bot_api = MessagingApi(api_client)
            print(event)
            user_id = event.source.user_id  # ดึง user_id
            user_corrections.setdefault(user_id, {"status": None, "image_receive": False, "image_path": None, "nutrition" : None, "food_name" : None})  # ตั้งค่าพื้นฐานหากไม่มีข้อมูล

            user_data = user_corrections[user_id]  # ดึงข้อมูลของผู้ใช้
            message_text = event.message.text  # ข้อความที่ได้รับจากผู้ใช้

            # print(user_corrections)
            
            if message_text == "เเก้ไขเมนู":
                # reply_text = "โปรดถ่ายรูปอาหารก่อนค่ะ!"
                if user_data["image_receive"]:
                    user_data["status"] = "edit"
                    reply_text = "โปรดป้อนชื่อเมนูที่ถูกต้องหนูหน่อยค่ะ!"
                    print("Edit menu")
                else:
                    reply_text = "โปรดส่งรูปอาหารก่อนค่ะ! 🍝"
            
            elif message_text == "บันทึก":
                if user_data["image_receive"]:
                    user_data["status"] = "correct"
                    reply_text = "ขอบคุณค่ะ รูปภาพของคุณได้ถูกบันทึกเรียบร้อยแล้ว!"
                    
                    lodingAnimation(user_id)
                    
                    # print("from",user_id,"user_data : ",user_data)
                    # print("nutrition : ",user_data.get("nutrition"))
                    # print("calories : ",user_data.get("nutrition").get("calories"))
                    # print("carbs : ",user_data.get("nutrition").get("carbs"))
                    # print("fat : ",user_data.get("nutrition").get("fat"))
                    # print("protein : ",user_data.get("nutrition").get("protein"))
                    # print("food_name : ",user_data.get("food_name"))
                    # print("food_type : ",user_data.get("food_type"))


                    print("API CALL SAVE DATA TO DATABASE ")
                    """
                        @params user_id ไลน์ไอดี
                        @params calories แคลอรี่
                        @params carbs คาร์โบไฮเดรต
                        @params fat ไขมัน
                        @params protein โปรตีน
                        @params food_name ชื่ออาหาร


                    """
                    data = {
                        "user_lineId" : user_id,
                        "calories" : user_data.get("nutrition").get("calories"),
                        "carbs" : user_data.get("nutrition").get("carbs"),
                        "fat" : user_data.get("nutrition").get("fat"),
                        "protein" : user_data.get("nutrition").get("protein"),
                        "food_name" : user_data.get("food_name"),
                        "food_type" : user_data.get("food_type")   
                    }
                    print(data)
                    result = save_eat_history(data) # จากไฟล์ service/user_data.py
                    print(result)
                    if (result.get("status") == "success"):
                        print("Save eat history successfully")
                        line_bot_api.reply_message(
                            reply_message_request=ReplyMessageRequest(
                                replyToken=event.reply_token,
                                messages=[TextMessage(text=reply_text, quick_reply=create_quick_reply())]
                            )
                        )
                        clear_user_correction(user_id)
                        return
                    else:
                        print("Insert data failed")
                        return

                    
                    
                    

                else:
                    reply_text = "โปรดส่งรูปอาหารก่อนค่ะ! 🍝"

            elif user_data["status"] == "edit" and user_data["image_receive"]:
                reply_text = f"เราจะทำการเรียนรู้รูปภาพนี้ใหม่เป็น '{message_text}' นะคะ 🙏 ขอบคุณคะ"
                clear_user_correction(user_id)
                print(f"Learning new menu: {message_text}")


            else:
                reply_text = "สวัสดีค่ะ! \nAI ของเราพร้อมช่วยคุณคำนวณแคลอรี่จากรูปภาพอาหาร แค่ส่งรูปมา ฉันจะบอกคุณทันทีว่าวันนี้กินไปกี่แคลฯ แล้วเก็บข้อมูลให้ด้วยนะคะ 🍱📊"  # ข้อความตอบกลับเริ่มต้น

        # ส่งข้อความตอบกลับ
        line_bot_api.reply_message(
            reply_message_request=ReplyMessageRequest(
                replyToken=event.reply_token,
                messages=[TextMessage(text=reply_text, quick_reply=create_quick_reply())]
            )
        )
    except Exception as e:
        print("error",str(e))
            




@handler.add(FollowEvent)
def handle_follow(event: FollowEvent):
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        reply_item = create_quick_reply()
        line_bot_api.reply_message(
            reply_message_request=ReplyMessageRequest(
                replyToken=event.reply_token,
                messages=[TextMessage(text="สวัสดีค่า!", quick_reply = reply_item)]
            )
        )



def clear_user_correction(user_id):
    user_corrections[user_id] = {"status": None, "image_receive": False, "image_path" : None, "nutrition" : None}  # ล้างข้อมูลเมื่อทำการบันทึก
   



def save_image_quick_reply():
    quick_reply = QuickReply(
        items=[
            QuickReplyItem(
                action=MessageAction(label="บันทึก", text="บันทึก"),
            )
        ]
    )
    return quick_reply


def create_quick_reply():
    quick_reply = QuickReply(
        items=[
           
            QuickReplyItem(
                action=CameraAction(label="ถ่ายรูปอาหาร"),
            ),
            QuickReplyItem(
                action=URIAction(label="ดูประวิติการกินอาหาร",uri="https://web-foodbuddy.vercel.app/")
            ),
            QuickReplyItem(
                action=URIAction(label="ตั้งเป้าหมายสุขภาพ",uri="https://web-foodbuddy.vercel.app/")
            ),
        ]
    )
    return quick_reply


def lodingAnimation(user_id):
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        line_bot_api.show_loading_animation(
            ShowLoadingAnimationRequest(
                chat_id=user_id,
                loadingSeconds=10
            )
        )
    return
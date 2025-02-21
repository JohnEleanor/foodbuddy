from pydantic import BaseModel

# class LineMessage(BaseModel):
#     message: str


class FoodRequest(BaseModel):
    name: str  # ชื่ออาหารที่ต้องการค้นหา

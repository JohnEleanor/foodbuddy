import pymysql.cursors
import os
from dotenv import load_dotenv

load_dotenv()




def connect_db():
    try:
 

        # เชื่อมต่อฐานข้อมูล
        connection = pymysql.connect(
            host=os.getenv("MYSQL_HOST"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE"), 
            port=int(os.getenv("MYSQL_PORT"))
        )
        if (connection):
            print("Database connection successful")
            return connection
        else:
            print("Database connection failed")
            return None
        

    except pymysql.Error as e:
        # จัดการข้อผิดพลาดเฉพาะของ pymysql
        print(f"Database connection error: {e}")
        return None
    except Exception as e:
        # จัดการข้อผิดพลาดทั่วไป
        print(f"An unexpected error occurred: {e}")
        return None

def close_db(connection):
    connection.close()
import os

def save_image(file_id, line_bot_blob_api):
    folder_path = "images"
    # if not os.path.exists(folder_path):
    #     os.makedirs(folder_path)

    file_name = os.path.join(folder_path, f"{file_id}.jpg")
    file_content = line_bot_blob_api.get_message_content(file_id)
    with open(file_name, "wb") as f:
        f.write(file_content)
        f.close()
    return file_name


def remove_image(file_name):
    os.remove(file_name)
    # print(f"Removed: {file_name}")
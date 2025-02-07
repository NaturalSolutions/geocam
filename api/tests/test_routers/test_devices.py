from fastapi import status

from src.main import app
from src.services.device import get_device


def test_read_devices(client, device, admin_headers):
    url = app.url_path_for("read_devices")

    response = client.get(url, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK

    content = response.json()
    # assert device.dict() in content


def test_read_device(client, device, admin_headers):
    url = app.url_path_for("read_device", device_id=device.id)

    response = client.get(url, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK


def test_create_device(client, admin_headers):
    url = app.url_path_for("create_device")
    device = {
        "name": "2nd device",
        "model": "model",
        "purchase_date": "2022-07-19",
        "price": 120,
        "description": "gcvsusbck",
        "detection_area": 1163,
        "status": "blabla",
        "operating_life": 0.0,
    }

    response = client.post(url, json=device, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK


def test_update_device(client, device, admin_headers):
    url = app.url_path_for("update_device", device_id=device.id)

    data = {
        "name": "2nd device",
        "model": "model",
        "purchase_date": "2022-07-19",
        "price": 140,
        "description": "Updated device",
        "detection_area": 1163,
        "status": "updated",
        "operating_life": 0.0,
    }

    response = client.put(url, json=data, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK

    content = response.json()
    assert content["name"] == data["name"]
    assert content["id"] == device.id


def test_delete_device(client, device, db, admin_headers):
    url = app.url_path_for("delete_device", device_id=device.id)

    response = client.delete(url, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK
    content = response.json()
    assert content["name"] == device.name
    assert content["id"] == device.id

    assert get_device(db, device_id=device.id) == None


def test_read_menu_devices(client, admin_headers):
    url = app.url_path_for("read_menu_devices")

    response = client.get(url, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK


def test_fetch_device_thumbnail(client, device, admin_headers):
    url = app.url_path_for("fetch_device_thumbnail", device_id=device.id)

    response = client.get(url, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK

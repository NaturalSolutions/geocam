from fastapi import status

from src.main import app
from src.services.site import get_site


def test_read_sites(client, site, admin_headers):
    url = app.url_path_for("read_sites")

    response = client.get(url, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK


def test_read_site(client, site, admin_headers):
    url = app.url_path_for("read_site", site_id=site.id)

    response = client.get(url, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK

    content = response.json()
    assert site.name == content["name"]
    assert site.id == content["id"]


def test_create_site(client, admin_headers):
    url = app.url_path_for("create_site")
    site = {
        "name": "New site",
        "latitude": 20.59,
        "longitude": 89.10,
        "description": "description",
        "habitat": "habitat",
    }

    response = client.post(url, json=site, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK


def test_update_site(client, site, admin_headers):
    url = app.url_path_for("update_site", site_id=site.id)

    data = {
        "name": "Site updated",
        "latitude": 35.59,
        "longitude": 70.10,
        "description": "description",
        "habitat": "habitat",
    }

    response = client.put(url, json=data, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK

    content = response.json()
    assert content["name"] == data["name"]
    assert content["id"] == site.id


def test_delete_site(client, site, db, admin_headers):
    url = app.url_path_for("delete_site", site_id=site.id)

    response = client.delete(url, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK
    content = response.json()
    assert content["name"] == site.name
    assert content["id"] == site.id

    assert get_site(db, site_id=site.id) == None


def test_fetch_site_thumbnail(client, site, admin_headers):
    url = app.url_path_for("fetch_site_thumbnail", site_id=site.id)

    response = client.get(url, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK

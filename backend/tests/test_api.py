from flask import Flask

def test_api(client: Flask.test_client):
    assert client.get("/auth/").status_code == 200
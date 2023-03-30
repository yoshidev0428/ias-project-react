import pytest


class TestTest:

    @pytest.mark.asyncio()
    async def test_basic(self, async_client):
        response = await async_client.get("/test")
        assert response.status_code == 200

    @pytest.mark.asyncio()
    async def test_w_req(self, async_client):
        response = await async_client.get("/test?request=123")
        assert response.status_code == 200
        assert response.json() == "123"

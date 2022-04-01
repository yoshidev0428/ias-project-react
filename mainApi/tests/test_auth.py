import pyotp
import pytest
from fastapi.encoders import jsonable_encoder
from starlette import status

from mainApi.app.auth.models.user import ShowUserModel, LoginUserReplyModel, CreateUserModel, CreateUserReplyModel, \
    ChangeUserPasswordModel, UpdateUserModel

from httpx import AsyncClient


class TestAuth:

    @pytest.mark.asyncio
    async def test_create_user(self, user_to_create: CreateUserModel, async_client: AsyncClient, db):
        users = await db["users"].find().to_list(None)
        assert len(users) == 0

        response = await async_client.post(url="auth/register", json=jsonable_encoder(user_to_create))

        assert response.status_code == status.HTTP_201_CREATED

        data = response.json()

        created_user = CreateUserReplyModel.parse_obj(data)

        # make sure the created user same as user to create, and that the defaults are correct
        assert created_user.user.full_name == user_to_create.full_name
        assert created_user.user.email == user_to_create.email
        assert created_user.user.is_admin is False
        assert created_user.user.is_active is True

        # look for created user in 'users'...should only be one user..
        users = await db["users"].find().to_list(None)
        assert ShowUserModel.parse_obj(users[0]).id == created_user.user.id

        # search for created user by email
        user_db_by_email = await db["users"].find_one({"email": created_user.user.email})
        assert user_db_by_email['_id'] == created_user.user.id
        assert ShowUserModel.parse_obj(user_db_by_email).id == created_user.user.id

        # search for created user by id
        user_db = await db["users"].find_one({"_id": created_user.user.id})
        assert user_db['_id'] == created_user.user.id

    @pytest.mark.asyncio
    async def test_auth_email_and_password(self, async_client: AsyncClient,
                                           user_to_create: CreateUserModel,
                                           created_user: CreateUserReplyModel):
        # incorrect email
        login_form = {"username": "wrong_email", "password": user_to_create.password}
        response_wrong_email = await async_client.post(url="auth/auth_email_password", data=login_form)
        assert response_wrong_email.status_code == status.HTTP_401_UNAUTHORIZED

        # incorrect password
        login_form = {"username": user_to_create.email, "password": "wrong_password"}
        response_wrong_password = await async_client.post(url="auth/auth_email_password", data=login_form)
        assert response_wrong_password.status_code == status.HTTP_401_UNAUTHORIZED

        login_form = {"username": user_to_create.email, "password": user_to_create.password}
        response = await async_client.post(url="auth/auth_email_password", data=login_form)

        assert response.status_code == status.HTTP_200_OK
        assert response.json() is None

    @pytest.mark.asyncio
    async def test_login(self, async_client: AsyncClient,
                         user_to_create: CreateUserModel,
                         created_user: CreateUserReplyModel):
        otp = pyotp.TOTP(created_user.otp_secret)

        # incorrect password
        login_form = {"username": user_to_create.email, "password": "wrong_password", "otp": otp.now()}
        response_wrong_password = await async_client.post(url="auth/login", data=login_form)

        assert response_wrong_password.status_code == status.HTTP_401_UNAUTHORIZED

        # incorrect otp
        login_form = {"username": user_to_create.email, "password": user_to_create.password, "otp": 123123}
        response_wrong_otp = await async_client.post(url="auth/login", data=login_form)

        assert response_wrong_otp.status_code == status.HTTP_401_UNAUTHORIZED

        # proper login
        login_form = {"username": user_to_create.email, "password": user_to_create.password, "otp": otp.now()}

        response = await async_client.post(url="auth/login", data=login_form)

        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        logged_in_user = LoginUserReplyModel.parse_obj(data)

        assert logged_in_user is not None
        assert logged_in_user.user.email == user_to_create.email
        assert logged_in_user.access_token is not None
        assert logged_in_user.token_type == 'Bearer'

    @pytest.mark.asyncio
    async def test_current_user(self, async_client_auth: AsyncClient,
                                created_user: CreateUserReplyModel):
        response = await async_client_auth.get(url="auth/current")

        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        current_user = ShowUserModel.parse_obj(data)

        assert created_user.user.id == current_user.id

    @pytest.mark.asyncio
    async def test_renew_token(self, async_client_auth: AsyncClient,
                               created_user: CreateUserReplyModel):
        response = await async_client_auth.get(url="auth/renew_token")

        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        renewed_token_user = LoginUserReplyModel.parse_obj(data)

        assert created_user.user.id == renewed_token_user.user.id
        assert renewed_token_user.access_token is not None

    @pytest.mark.asyncio
    async def test_update_current_user(self, async_client_auth: AsyncClient,
                                       created_user: CreateUserReplyModel):
        data = UpdateUserModel(full_name="new_fullname", email="new_email@test.com")
        response = await async_client_auth.put(url="auth/update_current_user", json=jsonable_encoder(data))

        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        updated_user = ShowUserModel.parse_obj(data)

        assert created_user.user.id == updated_user.id
        assert updated_user.full_name == "new_fullname"
        assert updated_user.email == "new_email@test.com"
        assert updated_user.created_at is not None  # to make sure non updated values are not set to None

    @pytest.mark.asyncio
    async def test_change_password(self, async_client_auth: AsyncClient,
                                   user_to_create: CreateUserModel,
                                   created_user: CreateUserReplyModel):
        otp = pyotp.TOTP(created_user.otp_secret)
        data = ChangeUserPasswordModel(old_password=user_to_create.password, otp=otp.now(), new_password='new_password')

        response = await async_client_auth.put(url="auth/change_password", json=jsonable_encoder(data))

        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        user_w_new_password = ShowUserModel.parse_obj(data)

        assert created_user.user.id == user_w_new_password.id

        # Test new password by logging in
        otp = pyotp.TOTP(created_user.otp_secret)
        login_form = {"username": user_to_create.email, "password": "new_password", "otp": otp.now()}

        response = await async_client_auth.post(url="auth/login", data=login_form)

        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        logged_in_user = LoginUserReplyModel.parse_obj(data)

        assert logged_in_user is not None
        assert logged_in_user.user.email == user_to_create.email

    # ------  ADMIN -------
    @pytest.mark.asyncio
    async def test_list_users_non_admin(self,
                                        async_client_auth: AsyncClient,
                                        created_user: CreateUserReplyModel):
        response = await async_client_auth.get(url="auth/admin/list")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio
    async def test_list_users_admin(self,
                                    async_client_auth_admin: AsyncClient,
                                    created_user: CreateUserReplyModel,
                                    other_created_user: CreateUserReplyModel):
        response = await async_client_auth_admin.get(url="auth/admin/list")
        assert response.status_code == status.HTTP_200_OK

        users = response.json()
        users = [ShowUserModel.parse_obj(user) for user in users]

        assert len(users) == 2

    @pytest.mark.asyncio
    async def test_update_user_non_admin(self,
                                         async_client_auth: AsyncClient,
                                         created_user: CreateUserReplyModel,
                                         other_created_user: CreateUserReplyModel):
        data = UpdateUserModel(full_name="new_fullname", email="new_email@test.com")

        response = await async_client_auth.put(url=f"auth/admin/{other_created_user.user.id}",
                                               json=jsonable_encoder(data))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio
    async def test_update_user(self,
                               async_client_auth_admin: AsyncClient,
                               created_user: CreateUserReplyModel,
                               other_created_user: CreateUserReplyModel):
        data = UpdateUserModel(full_name="new_fullname", email="new_email@test.com")

        response = await async_client_auth_admin.put(url=f"auth/admin/{str(other_created_user.user.id)}",
                                                     json=jsonable_encoder(data))
        assert response.status_code == status.HTTP_200_OK
        updated_user = ShowUserModel.parse_obj(response.json())

        assert updated_user.id == other_created_user.user.id
        assert updated_user.full_name == "new_fullname"
        assert updated_user.email == "new_email@test.com"
        assert updated_user.created_at is not None  # to make sure non updated values are not set to None

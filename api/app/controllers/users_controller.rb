class UsersController < ApplicationController
  before_action :authenticate_user, only: [:show]

  # Action to fetch the authenticated user's profile
  def show
    # The `@current_user` is set in the `authenticate_user` method of ApplicationController
    render json: {
      id: @current_user.id,
      firstName: @current_user.first_name,
      lastName: @current_user.last_name,
      email: @current_user.email
    }, status: :ok
  end

  def create
    @user = User.new(user_params)

    if User.exists?(email: @user.email)
      render json: { message: 'メールアドレスはすでに使用されています。' }, status: :unprocessable_entity
      return
    end

    if @user.save
      token = JwtService.encode(user_id: @user.id) # Generate JWT for new user

      render json: {
        message: '登録完了しました',
        user: {
          id: @user.id,
          firstName: @user.first_name,
          lastName: @user.last_name,
          email: @user.email
        },
        token: token
      }, status: :created
    else
      Rails.logger.error("User creation failed: #{@user.errors.full_messages}")
      render json: { message: @user.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :password)
  end

  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last # Extract token from Authorization header
    payload = JwtService.decode(token)
    @current_user = User.find(payload[:user_id])
  rescue JWT::DecodeError, ActiveRecord::RecordNotFound
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end
end

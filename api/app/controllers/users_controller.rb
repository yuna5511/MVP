class UsersController < ApplicationController
  def create
    @user = User.new(user_params)

    if User.exists?(email: @user.email)
      render json: { message: 'メールアドレスはすでに使用されています。' }, status: :unprocessable_entity
      return
    end

    if @user.save
      render json: { message: '登録完了しました' }, status: :created
    else
      Rails.logger.error("User creation failed: #{@user.errors.full_messages}")
      render json: { message: @user.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :password)
  end
end

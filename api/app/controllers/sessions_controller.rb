class SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = JwtService.encode(user_id: user.id)
      render json: { message: 'Login successful', token: token }, status: :ok
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end

  def destroy
    render json: { message: 'Logged out' }, status: :ok
  end
end

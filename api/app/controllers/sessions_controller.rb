class SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = JwtService.encode(user_id: user.id)
      render json: { token:, user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email } }, status: :ok
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end

  def destroy
    render json: { message: 'Logged out' }, status: :ok
  end
end

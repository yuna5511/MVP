class ApplicationController < ActionController::API
  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last # Get the token from the Authorization header
    payload = JwtService.decode(token)
    @current_user = User.find(payload[:user_id])
  rescue JWT::DecodeError
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end
end

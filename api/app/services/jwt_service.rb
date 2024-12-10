require 'jwt'

class JwtService
  SECRET_KEY = Rails.application.credentials.secret_key_base || ENV['SECRET_KEY_BASE']

  # Encode payload with expiration
  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  # Decode token and validate expiration
  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY).first
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::ExpiredSignature
    raise StandardError, 'Token has expired'
  rescue JWT::DecodeError
    raise StandardError, 'Invalid token'
  end
end

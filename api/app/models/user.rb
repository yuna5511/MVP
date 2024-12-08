class User < ApplicationRecord
  validates :first_name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :last_name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :password, presence: true, length: { minimum: 8 }
  validates :email, presence: true, uniqueness: true, length: { maximum: 255 }

  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP, message: "有効なメールアドレスを入力してください" }

  has_secure_password
end

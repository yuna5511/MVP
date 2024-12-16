class Plan < ApplicationRecord
  belongs_to :owner, class_name: 'User', optional: true
  has_and_belongs_to_many :users, class_name: 'User', join_table: 'plans_users'

  has_one :itinerary, dependent: :destroy
  has_many :places, dependent: :destroy
  has_many :hotels, dependent: :destroy
  has_many :flights, dependent: :destroy

  validates :title, presence: true
  validates :notes, length: { maximum: 10_000 }, allow_blank: true

  # 競合を避けるため、関連するユーザーの検証をスキップする。
  validates_associated :users, if: -> { false } # ユーザーを検証しない

  # ユーザーなしでプランを保存できるようにする
  def users=(value)
    super(value || []) # 値がnilの場合、空の配列を代入する
  end
end

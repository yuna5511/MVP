class Flight < ApplicationRecord
  belongs_to :plan

  validates :flight_number, presence: true
  validates :note, length: { maximum: 500 }, allow_blank: true
end

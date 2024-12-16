class Itinerary < ApplicationRecord
  belongs_to :plan
  has_many :days, dependent: :destroy

  validates :start_date, :end_date, presence: true
end

class Day < ApplicationRecord
  belongs_to :itinerary
  has_many :places, dependent: :destroy

  validates :date, presence: true
end

class Hotel < ApplicationRecord
  belongs_to :plan

  validates :google_place_id, presence: true
  validates :note, length: { maximum: 500 }, allow_blank: true
end

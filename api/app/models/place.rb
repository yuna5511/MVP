class Place < ApplicationRecord
  belongs_to :day, optional: true
  belongs_to :plan, optional: true

  validates :name, presence: true
end

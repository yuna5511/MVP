class Place < ApplicationRecord
  belongs_to :day, optional: true
  belongs_to :plan, optional: true

  validates :name, presence: true

  before_save :sanitize_notes

  private

  def sanitize_notes
    return if notes.nil?

    self.notes = ActionController::Base.helpers.sanitize(notes, tags: %w[a b i u p br], attributes: %w[href])
  end
end

class CreateDays < ActiveRecord::Migration[8.0]
  def change
    create_table :days do |t|
      t.date :date
      t.references :itinerary, null: false, foreign_key: true

      t.timestamps
    end
  end
end

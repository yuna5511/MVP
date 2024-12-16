class CreateItineraries < ActiveRecord::Migration[8.0]
  def change
    create_table :itineraries do |t|
      t.date :start_date
      t.date :end_date
      t.references :plan, null: false, foreign_key: true

      t.timestamps
    end
  end
end

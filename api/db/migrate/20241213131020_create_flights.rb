class CreateFlights < ActiveRecord::Migration[8.0]
  def change
    create_table :flights do |t|
      t.string :flight_number
      t.string :airline
      t.date :depart_date
      t.boolean :has_depart_time
      t.string :depart_airport
      t.date :arrive_date
      t.boolean :has_arrive_time
      t.string :confirmation_id
      t.string :note
      t.references :plan, null: false, foreign_key: true

      t.timestamps
    end
  end
end

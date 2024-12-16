class CreateHotels < ActiveRecord::Migration[8.0]
  def change
    create_table :hotels do |t|
      t.string :google_place_id, null: false
      t.date :check_in
      t.date :check_out
      t.string :confirmation_id
      t.string :note
      t.references :plan, null: false, foreign_key: true

      t.timestamps
    end
  end
end

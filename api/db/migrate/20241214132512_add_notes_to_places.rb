class AddNotesToPlaces < ActiveRecord::Migration[8.0]
  def change
    add_column :places, :notes, :text, null: true
  end
end

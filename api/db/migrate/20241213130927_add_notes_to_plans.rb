class AddNotesToPlans < ActiveRecord::Migration[8.0]
  def change
    add_column :plans, :notes, :text
  end
end

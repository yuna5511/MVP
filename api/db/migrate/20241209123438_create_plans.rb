class CreatePlans < ActiveRecord::Migration[8.0]
  def change
    create_table :plans do |t|
      t.string :title
      t.boolean :is_public

      t.timestamps
    end
  end
end

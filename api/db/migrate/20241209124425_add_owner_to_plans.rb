class AddOwnerToPlans < ActiveRecord::Migration[8.0]
  def change
    add_reference :plans, :owner, foreign_key: { to_table: :users }, null: true, default: nil
  end
end

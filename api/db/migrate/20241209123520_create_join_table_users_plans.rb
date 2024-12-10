class CreateJoinTableUsersPlans < ActiveRecord::Migration[8.0]
  def change
    create_join_table :users, :plans do |t|
      t.index :user_id
      t.index :plan_id
      t.index [:user_id, :plan_id], unique: true
    end
  end
end

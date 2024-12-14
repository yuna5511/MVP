class UpdateNotesInPlansToAllowNil < ActiveRecord::Migration[8.0]
  def change
    change_column :plans, :notes, :text, null: true
  end
end

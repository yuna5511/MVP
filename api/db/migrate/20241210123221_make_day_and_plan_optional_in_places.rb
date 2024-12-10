class MakeDayAndPlanOptionalInPlaces < ActiveRecord::Migration[8.0]
  def change
    change_column_null :places, :day_id, true
    change_column_null :places, :plan_id, true
  end
end

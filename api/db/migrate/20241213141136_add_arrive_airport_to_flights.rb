class AddArriveAirportToFlights < ActiveRecord::Migration[8.0]
  def change
    add_column :flights, :arrive_airport, :string
  end
end

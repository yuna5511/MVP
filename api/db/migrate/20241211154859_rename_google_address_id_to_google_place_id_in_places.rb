class RenameGoogleAddressIdToGooglePlaceIdInPlaces < ActiveRecord::Migration[8.0]
  def change
    rename_column :places, :google_address_id, :google_place_id
  end
end

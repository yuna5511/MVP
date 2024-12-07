class LocationValidatorController < ApplicationController
  def validate
    location = params[:location]
    results = Geocoder.search(location)

    if results.empty?
      render json: { isValid: false }, status: :unprocessable_entity
    else
      render json: { isValid: true }
    end
  end
end
